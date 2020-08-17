<template>
    <div>
        <data-table
            :widget="data"
            :border="border"
            :cell-class-name="getCellClassName"
            :cell-style="getCellStyle"
            :columns="availableColumns"
            :editable="editable"
            :showColumns="visibleColumns"
            :stripe="stripe"
            :tableData="fetchTableData"
            :widgetTitle="data.Title"
            @on-update-layout="onUpdateLayout"
            @sort-change="sortChange">
            <template v-slot:status_duration="{row}">
                <status-duration :extension="userExtension(row.user_id)"
                                 :key="row.user_id"
                                 :settings="getSettings"
                                 v-if="userExtension(row.user_id) && drawRow">
                </status-duration>
                <span v-else>---</span>
            </template>
            <template v-slot:status="{row}">
                <user-status :extension="userExtension(row.user_id)" :key="row.user_id"
                             :userId="row.user_id"
                             v-if="userExtension(row.user_id) && drawRow"/>
                <span v-else>---</span>
            </template>
            <template v-slot:extension_name="{row}">
                        <span :key="row.user_id" v-if="userExtension(row.user_id) && drawRow">
                            {{getExtensionName(row.user_id).ext_name}}
                        </span>
                <span v-else>---</span>
            </template>
            <template v-slot:user_name="{row}">
                        <span :key="row.user_id" v-if="userExtension(row.user_id) && drawRow">
                            {{userExtension(row.user_id).userName}}
                        </span>
                <span v-else>---</span>
            </template>
            <template v-slot:call_info="{row}">
                <calls-info :extension="userExtension(row.user_id)" :hideCallerInfo="true"
                            :key="row.user_id"
                            :userId="row.user_id"
                            v-if="userExtension(row.user_id) && drawRow"/>
                <span v-else>---</span>
            </template>
            <template v-slot:caller_info="{row}">
                <calls-info :extension="userExtension(row.user_id)" :hideCallInfo="true"
                            :key="row.user_id"
                            :userId="row.user_id"
                            v-if="userExtension(row.user_id) && drawRow"/>
                <span v-else>---</span>
            </template>
            <template v-slot:title>
                <base-widget-title :title="data.Title"/>
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
                <p class="text-main-sm px-2">{{fetchTableData.length}} {{$t('row(s)')}}</p>
            </template>
        </data-table>
    </div>
</template>
<script>
    import TimeFrame from './TimeFrame'
    import get from 'lodash/get'
    import UserStatus from './UserStatus'
    import StatusDuration from './StatusDuration'
    import DataTable from '@/components/Table/DataTable'
    import { extensionColor } from '@/util/extensionStyles'
    import { LOGOUT_STATUS } from '@/enum/extensionStatuses'
    import { realTimeSettings } from '@/enum/defaultWidgetSettings'
    import { dynamicRows } from '@/enum/realTimeTableConfigs'
    import dataTableMixin from '@/mixins/dataTableMixin'
    import CallsInfo from './CallsInfo'
    import cloneDeep from 'lodash/cloneDeep'

    export default {
        mixins: [dataTableMixin],
        components: {
            CallsInfo,
            DataTable,
            TimeFrame,
            UserStatus,
            StatusDuration,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: false,
            },
            tableData: {
                type: Array,
                default: () => [],
            },
            columns: {
                type: Array,
                default: () => [],
            },
            searchableFields: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                filter: '',
                border: true,
                drawRow: true,
                stripe: true,
                widget: cloneDeep(this.data),
            }
        },
        computed: {
            fetchTableData() {
                let tableData = this.tableData

                let showLoggedOutUsers = get(this.data.WidgetLayout, 'settings.showLoggedOutUsers')

                if (!showLoggedOutUsers) {
                    let userIds = this.loggedOutUserIds
                    tableData = tableData.filter((user) => user.user_id !== undefined && !userIds.includes(user.user_id) && this.userExtension(user.user_id))
                }

                if (this.filter && this.searchableFields.length > 0) {
                    tableData = tableData.filter(c => {
                        return this.searchableFields.some(field => {
                            if (c[field]) {
                                return c[field].toString().toLowerCase().includes(this.filter.toLowerCase())
                            }
                            return false
                        })
                    })
                }

                return tableData
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
            loggedOutUserIds() {
                return this.extensions.filter(e => e.representativeStatus === LOGOUT_STATUS).map((el) => el.userID)
            },
            getSettings() {
                return this.data.WidgetLayout.settings || realTimeSettings
            },
        },
        methods: {
            getExtensionName(userId) {
                const extensionNumber = this.userExtension(userId)
                return this.$store.getters['entities/getExtensionById'](extensionNumber.number)
            },
            userExtension(userId) {
                return this.extensions.find(e => e.userID === userId)
            },
            getCellStyle({ row, column }) {
                let color = 'transparent'

                if (dynamicRows.includes(column.property)) {
                    let extension = this.userExtension(row.user_id)
                    if (extension) {
                        color = extensionColor(extension)
                    }
                }
                return { 'background-color': color }
            },
            getCellClassName({ column, row }) {
                let className = ''
                let extension = this.userExtension(row.user_id)

                if (dynamicRows.includes(column.property) && extension) {
                    className = 'text-white'
                }

                return className
            },
            sortChange() {
                this.drawRow = false
                this.$nextTick(() => {
                    this.drawRow = true
                })
            },
        },
    }
</script>
<style lang="scss">
    td.text-white > .cell {
        color: white;
    }
</style>
