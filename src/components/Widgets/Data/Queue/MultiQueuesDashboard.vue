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
            @on-update-layout="onUpdateLayout">
            <template v-if="!displayQueueAsColumn" v-slot:header_title="{column}">
                <el-tooltip :content="getQueueName(column.prop)" :open-delay="300" placement="top">
                        <span class="font-medium uppercase">
                            {{getQueueName(column.prop)}}
                        </span>
                </el-tooltip>
            </template>
            <template v-slot:Callers="{row, index}">
                <caller-count :key="index" :queueID="row.queue_id"/>
            </template>
            <template v-slot:CurrentWaitTime="{row, index}">
                <max-wait-time :key="index" :queueID="row.queue_id"/>
            </template>
            <template v-slot:queue_id="{row}">
                {{getQueueName(row.queue_id)}}
            </template>
            <template v-slot:All="{row, index}">
                <div v-if="isMaxWaitTimeRealTimeRow(row)">
                    <max-wait-time :key="index" :queueID="queueWithOldestCall"/>
                </div>
                <div v-else>
                    {{getQueueTotals(row)}}
                </div>
            </template>
            <template v-slot:realTimeCell="{column, row, index}">
                <div v-if="isCallersRealTimeCell(column, row)">
                    <caller-count :key="index" :queueID="getColumnQueueID(column)"/>
                </div>
                <div v-if="isMaxWaitTimeRealTimeCell(column, row)">
                    <max-wait-time :key="index" :queueID="getColumnQueueID(column)"/>
                </div>
            </template>
            <template v-slot:title>
                <base-widget-title :title="data.Title"/>
            </template>
            <template v-slot:time-frame>
                <time-frame :widget="data"/>
            </template>
            <template v-slot:search-input>
                <div class="w-48 px-1">
                    <el-input
                        clearable
                        :placeholder="$t('Type text to filter')"
                        size="medium"
                        suffix-icon="el-icon-search"
                        v-model="filter"/>
                </div>
            </template>
            <template v-slot:additional-data>
                <p class="text-main-sm px-2">{{tableData.length}} row(s)</p>
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
    import {mapOrder} from "@/helpers/util";
    import minBy from 'lodash/minBy'
    import {getOptionsList} from "@/helpers/entitiesList";

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
                filter: '',
                border: true,
                stripe: false,
                widget: {},
                QUEUE_LIST_KEY: '{|queue_list|}',
            }
        },
        computed: {
            fetchTableData () {
                let tableData = this.tableData

                if (!this.displayQueueAsColumn) {
                    let visibleRows = this.columnsAreManaged ? this.visibleColumns : defaultVisibleColumns
                    tableData = tableData.filter(c => visibleRows.includes(c['Stat type']))
                    tableData = mapOrder(tableData, visibleRows, 'Stat type')
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
                return tableData
            },
            allEntityQueues () {
                return getOptionsList(`${this.QUEUE_LIST_KEY}`)
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
            allQueueCalls () {
                return this.$store.getters['queues/allQueueCalls']
            },
            selectedQueues () {
                try {
                    const queueListConfig = this.data.WidgetConfig.filter((config) => config.ParameterName === this.QUEUE_LIST_KEY)
                    return get(queueListConfig, '[0].WidgetParameterValueJson.EntityPositive', [])
                } catch (e) {
                    return []
                }
            },
            queueWithActiveCalls () {
                return this.$store.getters['queues/queueWithActiveCalls']
            },
            queueWithOldestCall () {
                const allCalls = []
                this.queueWithActiveCalls.forEach((queue) => {
                    let calls = queue.Calls || []
                    calls.map((call) => {
                        call['QueueID'] = queue.QueueID
                    })
                    allCalls.push(...calls)
                })
                let oldestCall = minBy(allCalls, 'JoinTimeStamp');
                return get(oldestCall, 'QueueID', null)
            },
        },
        methods: {
            getQueueName (queueID) {
                if (queueID === 'All' || queueID === 'Stat type') {
                    return queueID
                }

                let queue = this.allEntityQueues.filter((queue) => queue.queue_id === Number(queueID))
                return get(queue, '[0].q_name', '--')
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
                    
                    const selectedEntityQueues = this.selectedQueues

                    if (!selectedEntityQueues.length) {
                        return
                    }

                    let availableColumns = this.queuesData[0]

                    let data = [...this.queuesData]
                    let columns = []

                    let displayRowWithTotals = get(this.data.WidgetLayout, 'displayRowWithTotals', true)
                    let displayQueueAsColumn = this.displayQueueAsColumn


                    let queueIDsFromSocket = data.map((queue) => queue.queue_id)

                    selectedEntityQueues.forEach((queueID) => {
                        if (queueIDsFromSocket.includes(queueID)) {
                            return
                        }
                        let objectToAppend = {
                            'AvgRingTime': 0,
                            'CallCount': 0,
                            'ExitCounts': [],
                            'InSLACount': 0,
                            'MaxRingTime': 0,
                            'NotInSLACount': 0,
                            'queue_id': Number(queueID)
                        }
                        data.push(objectToAppend)
                    })

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

                } catch (e) {
                    console.warn(e)
                }
            },
            isCallersRealTimeCell (column, row) {
                if (['All', 'Stat type'].includes(column.prop)) {
                    return
                }
                return row['Stat type'] === 'Callers';
            },
            isMaxWaitTimeRealTimeCell (column, row) {
                if (['All', 'Stat type'].includes(column.prop)) {
                    return
                }
                return row['Stat type'] === 'CurrentWaitTime';
            },
            getColumnQueueID (column) {
                return Number(column.prop)
            },
            isMaxWaitTimeRealTimeRow (row) {
                return row['Stat type'] === 'CurrentWaitTime';
            },
            getQueueTotals (row) {
                if (row['Stat type'] === 'Callers') {
                    return this.allQueueCalls.length
                }
                return row['All']
            },
        },
        mounted () {
            if (!this.data.WidgetLayout.displayRowWithTotals) {
                this.$set(this.data.WidgetLayout, 'displayRowWithTotals', true)
            }
        },
        watch: {
            data: {
                immediate: true,
                deep: true,
                handler (data) {
                    this.widget = cloneDeep(data)
                    this.getWidgetData()
                }
            },
            queuesData: {
                immediate: true,
                deep: true,
                handler () {
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
