<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)">
        <p v-if="data.Title" class="text-2xl font-semibold"
           :class="$rtl.isRTL ? 'ml-5' : 'mr-5'">
            {{data.Title}}
        </p>
        <data-table :tableData="paginatedTableData"
                    :searchable-fields="searchableFields"
                    :editable="editable"
                    :columns="columns"
                    :cell-style="getCellStyle"
                    :stripe="stripe"
                    :border="border"
                    :cell-class-name="getCellClassName">
            <template v-slot:status_duration="{row, index}">
                <status-duration :extension="userExtension(row.user_id, index)"></status-duration>
            </template>
            <template v-slot:status="{row, index}">
                <user-status :userId="row.user_id" :extension="userExtension(row.user_id, index)"></user-status>
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
    import {Pagination, Select, Option} from 'element-ui'
    import UserStatus from './UserStatus'
    import StatusDuration from './StatusDuration'
    import {WidgetDataApi} from '@/api/widgetDataApi'
    import DataTable from '@/components/Table/DataTable'
    import {extensionColor} from '@/util/extensionStyles'
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
            endPoint: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                tableData: [],
                columns: [],
                loading: true,
                pageSizes: [5, 10, 25, 50],
                pageSize: 5,
                pagerCount: 5,
                currentPage: 1,
            }
        },
        computed: {
            extensions() {
                return this.$store.state.extensions.extensions
            },
            searchableFields() {
                return this.columns.map(c => c.prop)
            },
            paginatedTableData() {
                return this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            }
        },
        methods: {
            userExtension(userId, rowIndex) {
                let extensions = this.extensions.filter(e => e.userID === userId)
                if (extensions) {
                    return extensions[rowIndex]
                }
                return {}
            },
            getCellStyle({row, column, rowIndex}) {
                let color = 'white'
                if (dynamicRows.includes(column.property)) {
                    let extension = this.userExtension(row.user_id, rowIndex)
                    if (extension) {
                        color = extensionColor(extension)
                    }
                }
                return {'background-color': color}
            },
            getCellClassName({column}) {
                if (dynamicRows.includes(column.property)) {
                    return 'text-white'
                }
                return ''
            },
            async getTableData() {
                try {
                    let data = await WidgetDataApi.getData(this.endPoint)
                    let columns = [];
                    this.tableData = data
                    if (!data.length) {
                        this.loading = false
                        return
                    }
                    for (let column in data[0]) {
                        columns.push({
                            prop: column,
                            align: 'left',
                            showOverflowTooltip: true,
                            label: column,
                            resizable: true
                        })
                    }

                    // TODO use a better check later on
                    if (this.endPoint.includes('GetDataByUser')) {
                        columns.splice(3, 0, dynamicColumns[0], dynamicColumns[1])
                        //TODO: update - this is current user_id for testing
                        data[0]['user_id'] = 106576
                    }
                    this.tableData = data
                    this.columns = columns
                } catch (e) {

                } finally {
                    this.loading = false
                    this.$emit('on-loading', false)
                }
            },
            handlePageChange(val) {
                this.currentPage = val
            }
        },
        mounted() {
            this.getTableData()
            this.$emit('on-loading', true)
        }
    }

</script>

<style lang="scss">
    td.text-white > .cell {
        color: white;
    }
</style>
