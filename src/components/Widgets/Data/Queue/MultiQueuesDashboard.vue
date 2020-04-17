<template>
    <div>
        <data-table
            :border="border"
            :cell-class-name="getCellClassName"
            :cell-style="getCellStyle"
            :columns="getAvailableColumns"
            :editable="editable"
            :manageColumns='displayQueueAsColumn'
            :row-style="getRowStyle"
            :showColumns="getVisibleColumns"
            :stripe="stripe"
            :tableData="fetchTableData"
            :widgetTitle="data.Title"
            @on-update-layout="onUpdateLayout"
            v-if="drawRow">
            <template v-if="!displayQueueAsColumn" v-slot:header_title="{column}">
                <el-tooltip :content="getQueueName(column.prop)" :open-delay="300" placement="top">
                        <span class="font-medium uppercase">
                            {{getQueueName(column.prop)}}
                        </span>
                </el-tooltip>
            </template>
            <template v-slot:Callers="{row, index}">
                <div :key="$index">
                    {{row.queue_id}}
                    <caller-count :key="index" :queueID="row.queue_id"/>
                </div>
            </template>
            <template v-slot:MaxWaitTime="{row, index}">
                <max-wait-time :key="index" :queueID="row.queue_id"/>
            </template>
            <template v-slot:queue_id="{row}">
                {{getQueueName(row.queue_id)}}
            </template>
            <template v-slot:realTimeCell="{row, $index}">
                <div v-if="isRealTimeCell(row)">
                    comming
                </div>
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
    import {Option, Pagination, Select, Tooltip} from 'element-ui'
    import DataTable from '@/components/Table/DataTable'
    import {
        defaultVisibleColumns,
        formatQueueDashboardsData,
        queueDashboardColumnStyles
    } from "@/helpers/multiQueueDashboard";
    import dataTableMixin from "@/mixins/dataTableMixin";
    import CallerCount from "./CallerCount";
    import MaxWaitTime from "./MaxWaitTime";

    export default {
        name: 'queues-table',
        mixins: [dataTableMixin],
        components: {
            CallerCount,
            MaxWaitTime,
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
            queuesData: {
                type: Array,
                default: []
            },
            tableConfigs: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                tableData: [],
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
                drawRow: true,
                widget: {},
            }
        },
        computed: {
            fetchTableData () {
                let tableData = this.tableData

                if (!this.displayQueueAsColumn) {
                    let visibleRows = this.columnsAreManaged ? this.visibleColumns : defaultVisibleColumns
                    tableData = tableData.filter(c => visibleRows.includes(c['Stat type']))
                    tableData = this.mapOrder(tableData, visibleRows, 'Stat type')
                }

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
            allQueues () {
                return this.$store.state.queues.all
            },
            displayQueueAsColumn () {
                return get(this.data.WidgetLayout, 'displayQueueAsColumn', false)
            },
            columnsAreManaged () {
                return !!get(this.widget.WidgetLayout, 'Columns.visibleColumns');
            },
            getAvailableColumns () {
                if (!this.displayQueueAsColumn) {
                    return this.columns
                }
                return this.availableColumns
            },
            getVisibleColumns () {
                if (!this.displayQueueAsColumn) {
                    return this.columns.map(el => el.prop)
                }

                if (!this.columnsAreManaged) {
                    return defaultVisibleColumns
                }

                return this.visibleColumns
            },
        },
        methods: {
            mapOrder (array, order, key) {
                array.sort(function (a, b) {
                    let A = a[key]
                    let B = b[key]

                    if (order.indexOf(A) > order.indexOf(B)) {
                        return 1;
                    } else {
                        return -1;
                    }
                })
                return array
            },
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

                    if (!this.queuesData.length) {
                        return
                    }

                    let availableColumns = this.queuesData[0]
                    let data = this.queuesData
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

                    this.columns = columns
                    this.tableData = data

                    this.drawRow = false
                    this.$nextTick(() => {
                        this.drawRow = true
                    })

                } catch (e) {
                    console.warn(e)
                }
            },
            isRealTimeCell (row) {
                return ['Callers', 'MaxWaitTime'].includes(row['Stat type'])
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
            data: {
                immediate: true,
                deep: true,
                handler: function (data) {
                    this.widget = cloneDeep(data)
                }
            },
            queuesData: {
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


    .form-group {
        display: block;
        margin-bottom: 15px;
    }

    .form-group input {
        padding: 0;
        height: initial;
        width: initial;
        margin-bottom: 0;
        display: none;
        cursor: pointer;
    }

    .form-group label {
        position: relative;
        cursor: pointer;
    }

    .form-group label:before {
        content:'';
        -webkit-appearance: none;
        background-color: transparent;
        border: 2px solid #0079bf;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
        padding: 10px;
        display: inline-block;
        position: relative;
        vertical-align: middle;
        cursor: pointer;
        margin-right: 5px;
    }

    .form-group input:checked + label:after {
        content: '';
        display: block;
        position: absolute;
        top: 2px;
        left: 9px;
        width: 6px;
        height: 14px;
        border: solid #0079bf;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }
</style>
