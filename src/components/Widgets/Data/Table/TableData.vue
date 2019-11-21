<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)" class="pb-6">
        <data-table
            v-if="!loading"
            :tableData="fetchTableData"
            :editable="editable"
            :columns="columns"
            :stripe="stripe"
            :border="border"
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
                             :extension="userExtension(row.user_id)"></user-status>
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
                    <el-option v-for="option in pageSizes" :value="parseInt(option)" :key="option"></el-option>
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
                          clearable></el-input>
            </template>
            <template v-slot:data-counts>
                <p class="text-sm">{{dataCounts}} / {{filteredDataLength}} row(s)</p>
            </template>
        </data-table>
    </div>
</template>
<script>
    import startCase from 'lodash/startCase'
    import {Pagination, Select, Option} from 'element-ui'
    import UserStatus from './UserStatus'
    import StatusDuration from './StatusDuration'
    import {WidgetDataApi} from '@/api/widgetDataApi'
    import DataTable from '@/components/Table/DataTable'
    import {extensionColor} from '@/util/extensionStyles'
    import {isRealtimeWidget} from '@/helpers/widgetUtils'
    import {settings} from '@/enum/defaultRealTimeWidgetSettings'
    import {dynamicRows, dynamicColumns} from '@/enum/realTimeTableConfigs'

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
                loading: true,
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
                return this.data.WidgetLayout.settings || settings
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
                    let data = await WidgetDataApi.getData(this.data.EndPoint)
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
                    this.loading = false
                    this.$emit('on-loading', false)
                }
            },
            handlePageChange(val) {
                this.currentPage = val
            },
        },
        beforeMount() {
            this.getTableData()
            this.$emit('on-loading', true)
        },
        beforeDestroy() {
            clearInterval(this.fetchDataInterval)
        },
        watch: {
            filter() {
                this.currentPage = 1
            }
        },
    }
</script>
<style lang="scss">
    td.text-white > .cell {
        color: white;
    }
</style>
