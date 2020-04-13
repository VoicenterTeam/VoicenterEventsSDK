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
            :stripe="isStripeTable"
            :tableData="fetchTableData"
            :widgetTitle="data.Title"
            @on-update-layout="onUpdateLayout"
            @sort-change="sortChange">
            <template v-if="isMultiQueuesDashboard(data) && !displayQueueAsColumn" v-slot:header_title="{column}">
                {{getQueueName(column.prop)}}
            </template>
            <template v-if="isMultiQueuesDashboard(data)" v-slot:QueueName="{row}">
                {{getQueueName(row.QueueID)}}
            </template>
            <template v-if="isRealTimeTable" v-slot:status_duration="{row}">
                <status-duration :extension="userExtension(row.user_id)"
                                 :key="row.user_id"
                                 :settings="getSettings"
                                 v-if="userExtension(row.user_id) && drawRow">
                </status-duration>
                <span v-else>{{$t('N/A')}}</span>
            </template>
            <template v-if="isRealTimeTable" v-slot:status="{row}">
                <user-status :extension="userExtension(row.user_id)" :key="row.user_id"
                             :userId="row.user_id"
                             v-if="userExtension(row.user_id) && drawRow"/>
                <span v-else>{{$t('N/A')}}</span>
            </template>
            <template v-if="isRealTimeTable" v-slot:user_name="{row}">
                        <span :key="row.user_id" v-if="userExtension(row.user_id) && drawRow">
                            {{userExtension(row.user_id).userName}}
                        </span>
                <span v-else>---</span>
            </template>
            <template v-slot:Recording="{row}">
                <audio-player :url="getRecordingUrl(row.Recording)" v-if="row.Recording"/>
                <div v-else>{{$t('N/A')}}</div>
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
    import TimeFrame from "./TimeFrame";
    import get from 'lodash/get'
    import {format} from 'date-fns'
    import cloneDeep from 'lodash/cloneDeep'
    import startCase from 'lodash/startCase'
    import {Option, Pagination, Select} from 'element-ui'
    import UserStatus from './UserStatus'
    import AudioPlayer from "@/components/Audio/AudioPlayer";
    import {WidgetApi} from '@/api/widgetApi'
    import StatusDuration from './StatusDuration'
    import DataTable from '@/components/Table/DataTable'
    import {extensionColor} from '@/util/extensionStyles'
    import {isMultiQueuesDashboard, isRealtimeWidget} from '@/helpers/widgetUtils'
    import {LOGOUT_STATUS} from '@/enum/extensionStatuses'
    import {realTimeSettings} from '@/enum/defaultWidgetSettings'
    import {dynamicColumns, dynamicRows} from '@/enum/realTimeTableConfigs'
    import {getDefaultTimeDelay} from "@/enum/generic";
    import {formatQueueDashboardsData, queueDashboardColumnStyles} from "@/helpers/multiQueueDashboard";
    import {getWidgetData} from "@/services/widgetService";

    export default {
        components: {
            DataTable,
            TimeFrame,
            UserStatus,
            AudioPlayer,
            StatusDuration,
            [Select.name]: Select,
            [Option.name]: Option,
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
                fetchDataInterval: null,
                filter: '',
                filteredDataLength: null,
                hideOnSinglePage: true,
                border: true,
                widget: cloneDeep(this.data),
                drawRow: true,
            }
        },
        computed: {
            isStripeTable() {
                return !this.isMultiQueuesDashboard(this.widget);
            },
            fetchTableData () {
                let tableData = this.tableData

                let showLoggedOutUsers = get(this.data.WidgetLayout, 'settings.showLoggedOutUsers')
                if (!showLoggedOutUsers && this.isRealTimeTable) {
                    let userIds = this.loggedOutUserIds
                    tableData = tableData.filter((user) => user.user_id !== undefined && !userIds.includes(user.user_id) && this.userExtension(user.user_id))
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
            extensions () {
                return this.$store.state.extensions.extensions
            },
            loggedOutUserIds () {
                return this.extensions.filter(e => e.representativeStatus === LOGOUT_STATUS).map((el) => el.userID)
            },
            dataCounts () {
                if (this.filteredDataLength) {
                    let from = this.pageSize * (this.currentPage - 1) + 1;
                    let to = (this.pageSize * this.currentPage) < this.filteredDataLength ? (this.pageSize * this.currentPage) : this.filteredDataLength
                    return from + ' - ' + to
                }
                return 0 + ' - ' + 0
            },
            isRealTimeTable () {
                return isRealtimeWidget(this.widget)
            },
            getSettings () {
                return this.data.WidgetLayout.settings || realTimeSettings
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
            isMultiQueuesDashboard,
            getQueueName (queueID) {
                if (queueID === 'All' || queueID === 'Stat type') {
                    return queueID
                }

                let queue = this.allQueues.filter((queue) => queue.QueueID === queueID)
                return get(queue, '[0].QueueName', '--')
            },
            userExtension (userId) {
                return this.extensions.find(e => e.userID === userId)
            },
            getCellStyle ({row, column}) {
                let color = 'transparent'

                if (dynamicRows.includes(column.property)) {
                    let extension = this.userExtension(row.user_id)
                    if (extension) {
                        color = extensionColor(extension)
                    }
                }

                if (isMultiQueuesDashboard(this.widget)) {
                    color = get(queueDashboardColumnStyles[column.property], 'color')
                }

                return {'background-color': color}
            },
            getRowStyle ({row}) {
                if (!isMultiQueuesDashboard(this.widget)) {
                    return
                }

                let color = get(queueDashboardColumnStyles[row['Stat type']], 'color')
                return {'background-color': color}
            },
            getCellClassName ({column, row}) {
                let extension = this.userExtension(row.user_id)
                if (queueDashboardColumnStyles[column.property] || (dynamicRows.includes(column.property) && extension)) {
                    return 'text-white'
                }
                return ''
            },
            async getWidgetData () {
                try {
                    let data = await getWidgetData(this.widget)
                    if (!data) {
                        return
                    }
                    let columns = [];
                    let containsDate = false
                    let dateColumns = ['date & time', 'date', 'call time', 'contacted time']
                    if (data.length) {

                        let availableColumns = data[0]
                        let minWidth = 0

                        if (isMultiQueuesDashboard(this.data)) {
                            let displayRowWithTotals = get(this.data.WidgetLayout, 'displayRowWithTotals', true)
                            let displayQueueAsColumn = this.displayQueueAsColumn
                            let result = formatQueueDashboardsData(data, displayRowWithTotals, displayQueueAsColumn)

                            availableColumns = result.columns
                            data = result.data
                            minWidth = 130
                        }

                        for (let column in availableColumns) {
                            if (dateColumns.includes(column.toLowerCase())) {
                                containsDate = true
                                this.formatDateColumn(data, column)
                            }
                            const columnData = {
                                prop: column,
                                fixed: false,
                                align: 'center',
                                minWidth: minWidth,
                                label: this.$t(column) || startCase(column),
                                className: containsDate ? 'direction-ltr' : ''
                            }
                            columns.push(columnData)
                            if (column === 'Recording') {
                                columnData.minWidth = '320px'
                            }
                            this.searchableFields.push(column)
                        }
                        if (this.isRealTimeTable) {
                            columns.splice(3, 0, dynamicColumns[0], dynamicColumns[1], dynamicColumns[2])
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
            formatDateColumn (data, column) {
                data.forEach(row => {
                    if (row[column]) {
                        try {
                            // To prevent date-fns errors like: Invalid time value
                            row[column] = format(new Date(row[column]), 'HH:mm:ss dd-MM-yyyy')
                        } catch (e) {
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
            sortChange () {
                this.drawRow = false
                this.$nextTick(() => {
                    this.drawRow = true
                })
            },
        },
        mounted () {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }
            if (isMultiQueuesDashboard(this.data) && !this.data.WidgetLayout.displayRowWithTotals) {
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
                handler: function () {
                    this.getWidgetData()
                }
            }
        },
        beforeDestroy () {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
<style lang="scss">
    td.text-white > .cell {
        color: white;
    }
</style>
