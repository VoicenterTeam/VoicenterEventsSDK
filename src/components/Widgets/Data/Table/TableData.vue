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
            @on-update-layout="onUpdateLayout"
            :cell-style="getCellStyle"
            :cell-class-name="getCellClassName">
            <template v-if="isRealTimeTable" v-slot:status_duration="{row}">
                <status-duration v-if="userExtension(row.user_id)"
                                 :extension="userExtension(row.user_id)"
                                 :settings="getSettings">
                </status-duration>
                <span v-else>{{$t('N/A')}}</span>
            </template>
            <template v-if="isRealTimeTable" v-slot:status="{row}">
                <user-status v-if="userExtension(row.user_id)" :userId="row.user_id"
                             :extension="userExtension(row.user_id)"/>
                <span v-else>{{$t('N/A')}}</span>
            </template>
            <template v-if="isRealTimeTable" v-slot:user_name="{row}">
                        <span v-if="userExtension(row.user_id)">
                            {{userExtension(row.user_id).userName}}
                        </span>
                <span v-else>---</span>
            </template>
            <template v-slot:pagination>
                <el-select
                    v-model="pageSize"
                    @change="handlePageChange(1)"
                    :size="'small'"
                    class="w-16 mx-1">
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
            </template>
            <template v-slot:search-input>
                <el-input placeholder="Type text to filter" v-model="filter" suffix-icon="el-icon-search"
                          clearable/>
            </template>
            <template v-slot:additional-data>
                <p class="text-sm">{{dataCounts}} / {{filteredDataLength}} row(s)</p>
            </template>
        </data-table>
    </div>
</template>
<script>
    import startCase from 'lodash/startCase'
    import {Pagination, Select, Option} from 'element-ui'
    import UserStatus from './UserStatus'
    import {WidgetApi} from '@/api/widgetApi'
    import StatusDuration from './StatusDuration'
    import DataTable from '@/components/Table/DataTable'
    import {extensionColor} from '@/util/extensionStyles'
    import {getWidgetData} from '@/services/widgetService'
    import {isRealtimeWidget} from '@/helpers/widgetUtils'
    import {realTimeSettings} from '@/enum/defaultWidgetSettings'
    import {dynamicRows, dynamicColumns} from '@/enum/realTimeTableConfigs'
    import get from "lodash/get";

    export default {
        components: {
            DataTable,
            UserStatus,
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
                pageSizes: [5, 10, 25, 50],
                pageSize: 5,
                pagerCount: 5,
                currentPage: 1,
                fetchDataInterval: null,
                filter: '',
                filteredDataLength: null,
                hideOnSinglePage: true,
                border: true,
                stripe: true
            }
        },
        computed: {
            fetchTableData() {
                let tableData = this.tableData

                if (this.filter && this.searchableFields.length > 0) {
                    tableData = this.tableData.filter(c => {
                        return this.searchableFields.some(field => {
                            if (c[field]) {
                                return c[field].toString().toLowerCase().includes(this.filter.toLowerCase())
                            }
                            return false;
                        })
                    })
                    this.filteredDataLength = tableData.length
                } else {
                    this.filteredDataLength = this.tableData.length
                }

                return tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            },
            extensions() {
                return this.$store.state.extensions.extensions
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
                return isRealtimeWidget(this.data)
            },
            getSettings() {
                return this.data.WidgetLayout.settings || realTimeSettings
            },
            availableColumns() {
                return get(this.data.WidgetLayout, 'Columns.availableColumns') || this.columns
            },
            visibleColumns() {
                return get(this.data.WidgetLayout, 'Columns.visibleColumns') || this.columns.map(c => c.prop)
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
            async getTableData() {
                try {

                    let data = await getWidgetData(this.data)
                    let columns = [];

                    if (data.length) {
                        for (let column in data[0]) {
                            columns.push({
                                prop: column,
                                fixed: false,
                                align: 'center',
                                label: startCase(column)
                            })
                            this.searchableFields.push(column)
                        }

                        if (this.isRealTimeTable) {
                            columns.splice(3, 0, dynamicColumns[0], dynamicColumns[1], dynamicColumns[2])
                        }
                    }

                    this.tableData = data
                    this.columns = columns
                } catch (e) {
                    console.warn(e)
                } finally {
                }
            },
            handlePageChange(val) {
                this.currentPage = val
            },
            async onUpdateLayout(data) {
                this.data.WidgetLayout['Columns'] = data
                await WidgetApi.update(this.data)
                this.data = await WidgetApi.find(this.data.WidgetID)
            }
        },
        beforeDestroy() {
            clearInterval(this.fetchDataInterval)
        },
        watch: {
            filter() {
                this.currentPage = 1
            },
            data: {
                immediate: true,
                handler: function () {
                    this.getTableData()
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
