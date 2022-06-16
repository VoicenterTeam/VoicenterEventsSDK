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
            can-sort-rows="custom"
            @on-update-layout="onUpdateLayout"
            @sort-change="sortChange">
            <template v-slot:user_id="{row}">
                {{ row.user_id }}
            </template>
            <template v-slot:online_user_id="{row}">
                {{ getOnlineUserID(row.user_id) }}
            </template>
            <template v-slot:representant="{row}">
                {{ row.representant }}
            </template>
            <template v-slot:extension_id="{row}">
                {{ row.extension_id }}
            </template>
            <template v-slot:extension_name="{row}">
                        <span :key="row.user_id" v-if="userExtension(row.user_id) && drawRow">
                            {{ getExtensionName(row.user_id) }}
                        </span>
                <span v-else>---</span>
            </template>
            <template v-slot:user_name="{row}">
                        <span :key="row.user_id" v-if="userExtension(row.user_id) && drawRow">
                            {{ getUserName(row.user_id) }}
                        </span>
                <span v-else>---</span>
            </template>
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
                             :ref="`user-status-${row.user_id}`"
                             v-if="userExtension(row.user_id) && drawRow"/>
                <span v-else>---</span>
            </template>
            <template v-slot:call_info="{row}">
                <calls-info :extension="userExtension(row.user_id)" :hideCallerInfo="true"
                            :key="row.user_id"
                            :userId="row.user_id"
                            :settings="getSettings"
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
                <span class="px-4 flex items-center">
                    <time-frame :widget="data"/>
                </span>
            </template>
            <template v-slot:search-input>
                <div class="flex items-center w-48 px-1">
                    <el-input
                        clearable
                        :placeholder="$t('general.search')"
                        size="small"
                        v-model="filter">
                        <i slot="prefix" class="el-input__icon vc-icon-search icon-md text-primary ml-1" />
                    </el-input>
                </div>
            </template>
        </data-table>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import dataTableMixin from '@/mixins/dataTableMixin'
    import { extensionColor } from '@/util/extensionStyles'
    import { LOGOUT_STATUS } from '@/enum/extensionStatuses'
    import { dynamicRows } from '@/enum/realTimeTableConfigs'
    import { getInitialExtensionTime } from '@/util/timeUtils'
    import { realTimeSettings } from '@/enum/defaultWidgetSettings'
    import { displayUsersRelatedWithAdmin, ADMIN_USER_ID } from '@/helpers/util'
    
    export default {
        mixins: [dataTableMixin],
        components: {
            CallsInfo: () => import('./CallsInfo'),
            DataTable: () => import('@/components/Table/DataTable'),
            TimeFrame: () => import('./TimeFrame'),
            UserStatus: () => import('./UserStatus'),
            StatusDuration: () => import('./StatusDuration')
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
            adminSelected() {
                return displayUsersRelatedWithAdmin(this.data.WidgetConfig)
            },
            showLoggedOutUsers() {
                return get(this.data.WidgetLayout, 'settings.showLoggedOutUsers')
            },
            fetchTableData: {
                get: function () {
                    let tableData = this.tableData
                    if (!this.showLoggedOutUsers) {
                        let userIds = this.onlineUserIds
                        tableData = tableData.filter((user) => user.user_id !== undefined && userIds.includes(user.user_id))
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

                    tableData = tableData.map((row) => {
                        const extension = this.userExtension(row.user_id)

                        if (!extension) {
                            return row
                        }

                        return {
                            ...row,
                            online_user_id: extension.onlineUserID || '--',
                            representant: `${extension.userID} - ${get(extension, 'summery.representative', '-')}`,
                            extension_id: extension.number || '--',
                            user_name: extension.userName || '--',
                            extension_name: this.getExtensionName(row.user_id) || '--',
                            status: this.getExtensionStatusText(row.user_id),
                            status_duration: getInitialExtensionTime(extension, this.getSettings),
                            caller_info: extension.calls.length ? this.getCallerInfo(extension) : '',
                            call_info: extension.calls.length ? this.getCallInfo(extension) : '',
                        }
                    })

                    return tableData
                },
                set: function (newValue) {
                    return newValue
                }
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
            filteredExtensions() {
                if (this.adminSelected) {
                    return this.extensions
                }
                return this.extensions.filter(ext => ext.userID !== ADMIN_USER_ID)
            },
            onlineUserIds() {
                return this.onlineExtensions.map((el) => el.representative)
            },
            onlineExtensions() {
                return this.filteredExtensions.filter(e => e.representativeStatus !== LOGOUT_STATUS)
            },
            getSettings() {
                return this.data.WidgetLayout.settings || realTimeSettings
            },
        },
        methods: {
            getCallerInfo(userExtension) {
                let callerInfo = ''
                userExtension.calls.forEach((call) => {
                    callerInfo += call.callername
                })
                return callerInfo
            },
            getExtensionStatusText(userID) {
                const ref = this.$refs[`user-status-${userID}`]
                if (!ref) {
                    return '--'
                }
                
                return ref.statusText
            },
            getExtensionName(userId) {
                const extension = this.userExtension(userId)
                if (!extension) {
                    return '--'
                }
                return get(extension, 'userName', '--')
            },
            getCallInfo(userExtension) {
                let callInfo = 0
                userExtension.calls.forEach((call) => {
                    callInfo += Number(call.callStarted)
                })
                return callInfo
            },
            userExtension(userId) {
                if (!this.showLoggedOutUsers) {
                    return this.onlineExtensions.find(e => e.representative === userId)
                }
                return this.filteredExtensions.find(e => e.userID === userId || e.onlineUserID === userId)
            },
            getUserName(userId) {
                const extension = this.userExtension(userId)
                if (!extension) {
                    return '--'
                }
                return get(extension, 'summery.representative', extension.userName)
            },
            getOnlineUserID(userId) {
                const extension = this.userExtension(userId)
                if (!extension) {
                    return userId
                }
                return get(extension, 'onlineUserID', userId)
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
            /* TODO: Use this method in sort-change event handler if previous doesn't work */
            /*onSortChange({column, prop, order}) {
                if (prop === null) {
                    return
                }

                if (order === 'ascending') {
                    this.fetchTableData = this.fetchTableData.sort((a, b) => (a[prop] > b[prop]) ? 1 : -1)
                } else if (order === 'descending') {
                    this.fetchTableData = this.fetchTableData.sort((a, b) => (a[prop] < b[prop]) ? 1 : -1)
                }
            },*/
        },
    }
</script>
<style lang="scss">
td.text-white > .cell {
    color: white;
}
</style>

<style lang="scss" scoped>
::v-deep .el-input__inner::placeholder {
    @apply text-gray-500 font-medium text-base pl-1;
}
::v-deep .el-input__inner {
    @apply text-black font-medium text-base;
}
::v-deep .el-table .el-table__cell {
    padding: 6px 0px;
}
::v-deep .el-table thead th .cell {
    line-height: 15px;
    color: #6e6d6d;
    @apply flex;
}
</style>
