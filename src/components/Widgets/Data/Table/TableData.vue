<template>
    <div>
        <div v-if="isMultiQueuesDashboard(data)">
            <queues-table
                :data="data"
                :queuesData="queuesTableData"/>
        </div>
        <div v-if="isRealtimeWidget(data)">
            <RealTimeUserTable
                :columns="columns"
                :data="data"
                :searchableFields="searchableFields"
                :tableData="tableData">
            </RealTimeUserTable>
        </div>
        <div v-if="isSimpleTable">
            <data-table
                :widget="data"
                :border="border"
                :columns="availableColumns"
                :editable="editable"
                :showColumns="visibleColumns"
                :stripe="stripe"
                :allRecords="tableData"
                :tableData="fetchTableData"
                :widgetTitle="data.Title"
                @on-update-layout="onUpdateLayout">
                <template v-slot:Recording="{row}">
                    <audio-player :url="getRecordingUrl(row.Recording)" v-if="row.Recording"/>
                    <div v-else>{{$t('N/A')}}</div>
                </template>
                <template v-slot:pagination>
                    <div class="flex items-center">
                        <el-select
                            @change="handlePageChange(1)"
                            class="w-20 mx-1 py-1"
                            size="mini"
                            v-model="pageSize">
                            <el-option :key="option" :value="parseInt(option)" v-for="option in pageSizes"/>
                            <slot>
                                <div class="w-28 mx-2">
                                    <span class="text-xs flex justify-center pb-2">{{$t('Custom value')}}</span>
                                    <div class="flex flex-row">
                                        <el-input size="mini" class="mx-1" v-model="customPageSize"></el-input>
                                        <el-button size="mini" class="mx-1" @click="applyCustomPageSize">{{$t('Apply')}}</el-button>
                                    </div>
                                </div>
                            </slot>
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
                <template v-slot:time-frame>
                    <time-frame :widget="data"/>
                </template>
                <template v-slot:search-input>
                    <div class="flex items-center w-48 px-1">
                        <el-input
                            clearable
                            :placeholder="$t('Type text to filter')"
                            size="medium"
                            suffix-icon="el-icon-search"
                            v-model="filter"/>
                    </div>
                </template>
                <template v-slot:additional-data>
                    <p class="text-main-sm px-2" :style="getStyles">{{dataCounts}} / {{filteredDataLength}} {{$t('row(s)')}}</p>
                </template>
            </data-table>
        </div>
    </div>
</template>
<script>
    import RealTimeUserTable from "./RealTimeUserTable";
    import TimeFrame from "./TimeFrame";
    import get from 'lodash/get'
    import {format} from 'date-fns'
    import cloneDeep from 'lodash/cloneDeep'
    import startCase from 'lodash/startCase'
    import {Option, Pagination, Select} from 'element-ui'
    import AudioPlayer from "@/components/Audio/AudioPlayer";
    import DataTable from '@/components/Table/DataTable'
    import {isMultiQueuesDashboard, isRealtimeWidget} from '@/helpers/widgetUtils'
    import {getDefaultTimeDelay} from '@/enum/generic'
    import {getWidgetData} from "@/services/widgetService";
    import MultiQueuesDashboard from "@/components/Widgets/Data/Queue/MultiQueuesDashboard";
    import dataTableMixin from "@/mixins/dataTableMixin";
    import {dynamicColumns} from "@/enum/realTimeTableConfigs";

    const DATE_FORMAT = 'dd-MM-yyyy'
    const DATE_TIME_FORMAT = 'HH:mm:ss dd-MM-yyyy'

    export default {
        mixins: [dataTableMixin],
        components: {
            DataTable,
            TimeFrame,
            AudioPlayer,
            RealTimeUserTable,
            [Select.name]: Select,
            [Option.name]: Option,
            [Pagination.name]: Pagination,
            [MultiQueuesDashboard.name]: MultiQueuesDashboard,
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
        },
        data () {
            return {
                tableData: [],
                columns: [],
                searchableFields: [],
                pageSizes: [5, 10, 25, 50, 100, 500],
                pageSize: 10,
                customPageSize: 10,
                pagerCount: 5,
                currentPage: 1,
                fetchDataInterval: null,
                filter: '',
                filteredDataLength: null,
                hideOnSinglePage: true,
                border: true,
                widget: cloneDeep(this.data),
                stripe: true,
                queuesTableData: [],
                QUEUE_STATISTICS_TEMPLATE: 45,
            }
        },
        computed: {
            getStyles() {
                return this.$store.getters['layout/widgetTitleStyles']
            },
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

                if (tableData.length) {
                    return tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
                }
            },
            isSimpleTable () {
                return !this.isMultiQueuesDashboard(this.data) && !this.isRealtimeWidget(this.data);
            }
        },
        methods: {
            isMultiQueuesDashboard,
            isRealtimeWidget,
            async getWidgetData () {
                try {
                    let data = await getWidgetData(this.widget)

                    if (!data) {
                        return
                    }

                    if (isMultiQueuesDashboard(this.widget)) {
                        this.queuesTableData = data
                        return
                    }

                    let columns = [];
                    let containsDate = false
                    let dateColumns = ['date']
                    let dateTimeColumns = ['date & time', 'call time', 'contacted time', 'starttime', 'endtime']

                    if (data.length) {

                        for (let column in data[0]) {

                            if (dateTimeColumns.includes(column.toLowerCase())) {
                                containsDate = true
                                this.formatDateColumn(data, column, DATE_TIME_FORMAT)
                            }

                            if (dateColumns.includes(column.toLowerCase())) {
                                containsDate = true
                                this.formatDateColumn(data, column, DATE_FORMAT)
                            }

                            const columnData = {
                                prop: column,
                                fixed: false,
                                align: 'center',
                                label: this.$t(column) || startCase(column),
                                className: containsDate ? 'direction-ltr' : ''
                            }

                            columns.push(columnData)

                            if (column === 'Recording') {
                                columnData.minWidth = '320px'
                            }

                            this.searchableFields.push(column)
                        }

                        if (isRealtimeWidget(this.data)) {
                            columns.splice(3, 0, dynamicColumns[0], dynamicColumns[1], dynamicColumns[2], dynamicColumns[3], dynamicColumns[4])
                        }
                    }

                    this.tableData = data
                    this.columns = columns

                } catch (e) {
                    let status = get(e, 'response.status')
                    if (status === 400) {
                        let refreshDelay = getDefaultTimeDelay()
                        this.$set(this.data, 'DefaultRefreshInterval', refreshDelay)
                    }
                } finally {
                }
            },
            formatDateColumn (data, column, dateFormat) {
                data.forEach(row => {
                    if (this.widget.TemplateID.toString() === this.QUEUE_STATISTICS_TEMPLATE.toString()) {
                        row[column] = row[column].replace(/\//g,'-');
                        return
                    }
                    if (row[column]) {
                        try {
                            // To prevent date-fns errors like: Invalid time value
                            row[column] = format(new Date(row[column]), dateFormat)
                        } catch (e) {
                            row[column] = row[column].replace(/\//g,'-');
                            return row[column]
                        }
                    }
                })
                return data
            },
            getRecordingUrl (recordingLink) {
                const div = document.createElement('div')
                div.innerHTML = recordingLink
                const anchor = div.querySelector('a')
                if (anchor && anchor.href) {
                    return anchor.href
                }
                return ''
            },
            storePaginationSettings (pageSize) {
                this.data.WidgetLayout['paginationSize'] = Number(pageSize)
                this.$emit('on-update', this.data)
            },
            applyPaginationSettings() {
                this.pageSize = get(this.data.WidgetLayout, 'paginationSize', 10)
                this.customPageSize = this.pageSize
            },
            applyCustomPageSize() {
                const pageSize = this.customPageSize
                this.storePaginationSettings(pageSize)
            }
        },
        mounted () {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }

        },
        watch: {
            filter () {
                this.currentPage = 1
            },
            data: {
                immediate: true,
                deep: true,
                handler: function () {
                    this.getWidgetData()
                    this.applyPaginationSettings()
                }
            },
            pageSize: {
                handler: function (val) {
                    this.storePaginationSettings(val)
                }
            },
        },
        beforeDestroy () {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
