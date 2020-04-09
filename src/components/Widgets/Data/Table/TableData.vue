<template>
    <div>
        <data-table
            :tableData="fetchTableData"
            :columns="availableColumns"
            :showColumns="visibleColumns"
            :widgetTitle="data.Title"
            :editable="editable"
            :stripe="stripe"
            :border="border"
            :cell-style="getCellStyle"
            @sort-change="sortChange"
            @on-update-layout="onUpdateLayout"
            :cell-class-name="getCellClassName">
            <template v-if="isRealTimeTable" v-slot:status_duration="{row}">
                <status-duration v-if="userExtension(row.user_id) && drawRow"
                                 :key="row.user_id"
                                 :extension="userExtension(row.user_id)"
                                 :settings="getSettings">
                </status-duration>
                <span v-else>{{$t('N/A')}}</span>
            </template>
            <template v-if="isRealTimeTable" v-slot:status="{row}">
                <user-status v-if="userExtension(row.user_id) && drawRow" :userId="row.user_id"
                             :key="row.user_id"
                             :extension="userExtension(row.user_id)"/>
                <span v-else>{{$t('N/A')}}</span>
            </template>
            <template v-if="isRealTimeTable" v-slot:user_name="{row}">
                        <span v-if="userExtension(row.user_id) && drawRow" :key="row.user_id">
                            {{userExtension(row.user_id).userName}}
                        </span>
                <span v-else>---</span>
            </template>
            <template v-slot:Recording="{row}">
                <audio-player v-if="row.Recording" :url="getRecordingUrl(row.Recording)"/>
                <div v-else>{{$t('N/A')}}</div>
            </template>
            <template v-slot:pagination>
                <div class="flex items-center">
                    <el-select
                        v-model="pageSize"
                        @change="handlePageChange(1)"
                        size="mini"
                        class="w-16 mx-1 py-1">
                        <el-option v-for="option in pageSizes" :value="parseInt(option)" :key="option"/>
                    </el-select>
                    <el-pagination
                        @current-change="handlePageChange"
                        :page-sizes="pageSizes"
                        :pager-count="pagerCount"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        layout="prev, pager, next"
                        :hide-on-single-page="hideOnSinglePage"
                        :total="filteredDataLength">
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
                    size="medium"
                    placeholder="Type text to filter"
                    v-model="filter"
                    suffix-icon="el-icon-search"
                    clearable/>
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
    import {getWidgetData} from '@/services/widgetService'
    import {isRealtimeWidget} from '@/helpers/widgetUtils'
    import {LOGOUT_STATUS} from '@/enum/extensionStatuses'
    import {realTimeSettings} from '@/enum/defaultWidgetSettings'
    import {dynamicColumns, dynamicRows} from '@/enum/realTimeTableConfigs'
    import {getDefaultTimeDelay} from "@/enum/generic";

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
        data() {
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
                stripe: true,
                widget: cloneDeep(this.data),
                drawRow: true,
            }
        },
        computed: {
            fetchTableData() {
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
            extensions() {
                return this.$store.state.extensions.extensions
            },
            loggedOutUserIds() {
                return this.extensions.filter(e => e.representativeStatus === LOGOUT_STATUS).map((el) => el.userID)
            },
            dataCounts() {
                if (this.filteredDataLength) {
                    let from = this.pageSize * (this.currentPage - 1) + 1;
                    let to = (this.pageSize * this.currentPage) < this.filteredDataLength ? (this.pageSize * this.currentPage) : this.filteredDataLength
                    return from + ' - ' + to
                }
                return 0 + ' - ' + 0
            },
            isRealTimeTable() {
                return isRealtimeWidget(this.widget)
            },
            getSettings() {
                return this.data.WidgetLayout.settings || realTimeSettings
            },
            availableColumns() {
                return get(this.widget.WidgetLayout, 'Columns.availableColumns') || this.columns
            },
            visibleColumns() {
                return get(this.widget.WidgetLayout, 'Columns.visibleColumns') || this.columns.map(c => c.prop)
            }
        },
        methods: {
            userExtension(userId) {
                return this.extensions.find(e => e.userID === userId)
            },
            getCellStyle({row, column}) {
                let color = 'transparent'
                if (dynamicRows.includes(column.property)) {
                    let extension = this.userExtension(row.user_id)
                    if (extension) {
                        color = extensionColor(extension)
                    }
                }
                return {'background-color': color}
            },
            getCellClassName({column, row}) {
                let extension = this.userExtension(row.user_id)
                if (dynamicRows.includes(column.property) && extension) {
                    return 'text-white'
                }
                return ''
            },
            async getWidgetData() {
                try {
                    let data = await getWidgetData(this.widget)
                    if (!data) {
                        return
                    }
                    let columns = [];
                    let containsDate = false
                    let dateColumns = ['date & time', 'date', 'call time', 'contacted time']
                    if (data.length) {
                        for (let column in data[0]) {
                            if (dateColumns.includes(column.toLowerCase())) {
                                containsDate = true
                                this.formatDateColumn(data, column)
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
                            this.searchableFields.push(columnData)

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
            formatDateColumn(data, column) {
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
            getRecordingUrl(recordingLink) {
                const div = document.createElement('div')
                div.innerHTML = recordingLink
                const anchor = div.querySelector('a')
                if (anchor && anchor.href) {
                    return anchor.href
                }
                return ''
            },
            handlePageChange(val) {
                this.currentPage = val
            },
            async onUpdateLayout(data) {
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
            sortChange() {
                this.drawRow = false
                this.$nextTick(() => {
                    this.drawRow = true
                })
            },
        },
        mounted() {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }
        },
        watch: {
            filter() {
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
        beforeDestroy() {
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
