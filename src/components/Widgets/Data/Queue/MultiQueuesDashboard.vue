<template>
    <div>
        <data-table
            :border="border"
            :cell-class-name="getCellClassName"
            :cell-style="getCellStyle"
            :columns="availableColumns"
            :editable="editable"
            :row-style="getRowStyle"
            :showColumns="visibleColumns"
            :stripe="stripe"
            :tableData="fetchTableData"
            :widgetTitle="data.Title"
            @on-update-layout="onUpdateLayout">
            <template v-if="!displayQueueAsColumn" v-slot:header_title="{column}">
                <el-tooltip :content="getQueueName(column.prop)" :open-delay="300" placement="top">
                        <span class="font-medium uppercase">
                            {{getQueueName(column.prop)}}
                        </span>
                </el-tooltip>
            </template>
            <template v-slot:QueueName="{row}">
                {{getQueueName(row.QueueID)}}
            </template>
            <template v-slot:pagination>
                <div class="flex items-center">
                    <el-select
                        @change="handlePageChange(1)"
                        class="w-16 mx-1 py-1"
                        size="mini"
                        v-model="pageSize">
                        <el-option :key="option" :value="parseInt(option)" v-for="option in pageSizes"/>
                    </el-select>
                    <el-pagination
                        :current-page="currentPage"
                        :hide-on-single-page="hideOnSinglePage"
                        :page-size="pageSize"
                        :page-sizes="pageSizes"
                        :pager-count="pagerCount"
                        :total="filteredDataLength"
                        @current-change="handlePageChange"
                        layout="prev, pager, next">
                    </el-pagination>
                </div>
            </template>
            <template v-slot:title>
                <base-widget-title :title="data.Title"/>
            </template>
            <template v-slot:time-frame>
                <time-frame :widget="data"/>
            </template>
            <template v-slot:search-input>
                <el-input
                    clearable
                    placeholder="Type text to filter"
                    size="medium"
                    suffix-icon="el-icon-search"
                    v-model="filter"/>
            </template>
            <template v-slot:additional-data>
                <p class="text-main-sm px-2">{{dataCounts}} / {{filteredDataLength}} row(s)</p>
            </template>
        </data-table>
    </div>
</template>
<script>
    import TimeFrame from "../Table/TimeFrame";
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import startCase from 'lodash/startCase'
    import {Option, Pagination, Select, Tooltip} from 'element-ui'
    import {WidgetApi} from '@/api/widgetApi'
    import DataTable from '@/components/Table/DataTable'
    import {formatQueueDashboardsData, queueDashboardColumnStyles} from "@/helpers/multiQueueDashboard";

    export default {
        name: 'queues-table',
        components: {
            DataTable,
            TimeFrame,
            [Select.name]: Select,
            [Option.name]: Option,
            [Tooltip.name]: Tooltip,
            [Pagination.name]: Pagination,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: false
            },
            tableData: {
                type: Array,
                default: []
            }
        },
        data () {
            return {
                columns: [],
                searchableFields: [],
                pageSizes: [5, 10, 25, 50, 100, 500],
                pageSize: 5,
                pagerCount: 5,
                currentPage: 1,
                filter: '',
                filteredDataLength: null,
                hideOnSinglePage: true,
                border: true,
                stripe: false,
                widget: cloneDeep(this.data),
            }
        },
        computed: {
            fetchTableData () {
                let tableData = this.tableData

                if (this.filter && this.searchableFields.length > 0) {
                    tableData = tableData.filter(c => {
                        return this.searchableFields.some(field => {
                            if (c[field]) {
                                return c[field].toString().toLowerCase().includes(this.filter.toLowerCase())
                            }
                            return false;
                        })
                    })
                }
                this.filteredDataLength = tableData.length
                return tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            },
            dataCounts () {
                if (this.filteredDataLength) {
                    let from = this.pageSize * (this.currentPage - 1) + 1;
                    let to = (this.pageSize * this.currentPage) < this.filteredDataLength ? (this.pageSize * this.currentPage) : this.filteredDataLength
                    return from + ' - ' + to
                }
                return 0 + ' - ' + 0
            },
            availableColumns () {
                return get(this.widget.WidgetLayout, 'Columns.availableColumns') || this.columns
            },
            visibleColumns () {
                return get(this.widget.WidgetLayout, 'Columns.visibleColumns') || this.columns.map(c => c.prop)
            },
            allQueues () {
                return this.$store.state.queues.all
            },
            displayQueueAsColumn () {
                return get(this.data.WidgetLayout, 'displayQueueAsColumn', false)
            }
        },
        methods: {
            getQueueName (queueID) {
                if (queueID === 'All' || queueID === 'Stat type') {
                    return queueID
                }

                let queue = this.allQueues.filter((queue) => queue.QueueID === Number(queueID))
                return get(queue, '[0].QueueName', '--')
            },
            getCellStyle ({row, column}) {
                let color = get(queueDashboardColumnStyles[column.property], 'color', 'transparent')
                return {'background-color': color}
            },
            getRowStyle ({row}) {
                let color = get(queueDashboardColumnStyles[row['Stat type']], 'color')
                return {'background-color': color}
            },
            getCellClassName ({column, row}) {
                let className = ''

                if (queueDashboardColumnStyles[column.property] || queueDashboardColumnStyles[row['Stat type']]) {
                    className = 'text-white'
                }

                return className
            },
            async getWidgetData () {
                try {

                    if (!this.tableData.length) {
                        return
                    }

                        let availableColumns = this.tableData[0]
                        let data = this.tableData
                        let columns = []

                        let displayRowWithTotals = get(this.data.WidgetLayout, 'displayRowWithTotals', true)
                        let displayQueueAsColumn = this.displayQueueAsColumn
                        let result = formatQueueDashboardsData(data, displayRowWithTotals, displayQueueAsColumn)

                        availableColumns = result.columns
                        data = result.data

                        for (let column in availableColumns) {

                            const columnData = {
                                prop: column,
                                fixed: false,
                                align: 'center',
                                minWidth: 130,
                                label: this.$t(column) || startCase(column),
                            }

                            columns.push(columnData)
                            this.searchableFields.push(column)
                        }

                    this.tableData = data
                    this.columns = columns

                } catch (e) {
                    console.warn(e)
                }
            },

            handlePageChange (val) {
                this.currentPage = val
            },
            async onUpdateLayout (data) {
                this.widget.WidgetLayout['Columns'] = data
                await WidgetApi.update(this.widget)
                let updatedWidget = await WidgetApi.find(this.widget.WidgetID)
                this.widget = {
                    ...this.widget,
                    ...updatedWidget,
                    WidgetConfig: this.widget.WidgetConfig
                }
                this.data.WidgetLayout = updatedWidget.WidgetLayout || this.widget.WidgetLayout
            },
        },
        mounted () {
            if (!this.data.WidgetLayout.displayRowWithTotals) {
                this.$set(this.data.WidgetLayout, 'displayRowWithTotals', true)
            }
        },
        watch: {
            filter () {
                this.currentPage = 1
            },
            tableData: {
                immediate: true,
                deep: true,
                handler: function () {
                    this.getWidgetData()
                }
            }
        },
    }
</script>
<style lang="scss">
    td.text-white > .cell {
        color: white;
    }
</style>
