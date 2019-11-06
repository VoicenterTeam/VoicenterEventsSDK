<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)" class="pb-6">
        <data-table
            v-if="!loading"
            :tableData="fetchTableData"
            :editable="editable"
            :columns="columns"
            :stripe="stripe"
            :searchableFields="searchableFields"
            :border="border"
            :cell-style="getCellStyle"
            :cell-class-name="getCellClassName">
            <template v-slot:status_duration="{row}">
                <status-duration v-if="userExtension(row.user_id)" :extension="userExtension(row.user_id)"></status-duration>
                <span v-else>{{$t('N/A')}}</span>
            </template>
            <template v-slot:status="{row}">
                <user-status v-if="userExtension(row.user_id)" :userId="row.user_id" :extension="userExtension(row.user_id)"></user-status>
                <span v-else>{{$t('N/A')}}</span>
            </template>
            <template v-slot:user_name="{row}">
                <span v-if="userExtension(row.user_id)">{{userExtension(row.user_id).userName}}</span>
                <span v-else>---</span>
            </template>
            <template v-slot:pagination>
                <el-select
                    v-model="pageSize"
                    :size="'small'"
                    class="w-16">
                    <el-option v-for="option in pageSizes" :value="parseInt(option)" :key="option"></el-option>
                </el-select>
                <el-pagination
                    @current-change="handlePageChange"
                    :page-sizes="pageSizes"
                    :pager-count="pagerCount"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    layout="prev, pager, next"
                    :total="tableData.length">
                </el-pagination>
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
    import {dynamicRows, refreshDataInterval, dynamicColumns} from '@/enum/realTimeTableConfigs'
    import { getWidgetEndpoint } from "@/helpers/wigetUtils";

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
            border: {
                type: Boolean,
                default: true
            },
            stripe: {
                type: Boolean,
                default: true
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
                searchableFields: ['user_id'],
                pageSizes: [5, 10, 25, 50],
                pageSize: 5,
                pagerCount: 5,
                currentPage: 1,
                fetchDataInterval: null
            }
        },
        computed: {
            fetchTableData() {
                return this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
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
            getCellClassName({column, row }) {
                let extension = this.userExtension(row.user_id)
                if (dynamicRows.includes(column.property) && extension) {
                    return 'text-white'
                }
                return ''
            },
            async getDataByUser() {
                try {
                    let endpoint = getWidgetEndpoint(this.data)
                    let data = await WidgetDataApi.getData(endpoint)
                    let columns = [];

                    if (data.length) {
                        for (let column in data[0]) {
                            columns.push({
                                prop: column,
                                fixed: false,
                                align: 'center',
                                label: startCase(column)
                            })
                        }
                        columns.splice(3, 0, dynamicColumns[0], dynamicColumns[1], dynamicColumns[2])
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
        mounted() {
            this.getDataByUser()
            this.fetchDataInterval = setInterval(() => {
                this.getDataByUser()
            }, refreshDataInterval)
            this.$emit('on-loading', true)
        },
        beforeDestroy() {
            clearInterval(this.fetchDataInterval)
        }
    }
</script>
<style lang="scss">
    td.text-white > .cell {
        color: white;
    }
</style>
