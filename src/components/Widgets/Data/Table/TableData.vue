<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)">
        <data-table
            v-if="!loading"
            :tableData="tableData"
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
        </data-table>
    </div>
</template>
<script>
    import DataTable from '@/components/Table/DataTable'
    import UserStatus from './UserStatus'
    import StatusDuration from './StatusDuration'
    import {WidgetDataApi} from '@/api/widgetDataApi'
    import {extensionColor} from '@/util/extensionStyles'

    const dynamicRows = ['status', 'status_duration']
    const dynamicColumns = [{
        prop: 'status',
        fixed: false,
        align: 'left',
        label: 'Status'
    }, {
        prop: 'status_duration',
        fixed: false,
        align: 'left',
        label: 'Current Status Duration',
        width: '250px'
    }]

    export default {
        components: {
            DataTable,
            UserStatus,
            StatusDuration
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
        },
        data() {
            return {
                tableData: [],
                columns: [],
                loading: true,
                searchableFields: ['User', 'Department']
            }
        },
        computed: {
            extensions() {
                return this.$store.state.extensions.extensions
            },
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
                    let data = await WidgetDataApi.getTableData(this.data.WidgetID)
                    let columns = [];

                    if (data.length) {
                        for (let column in data[0]) {
                            columns.push({
                                prop: column,
                                fixed: false,
                                align: 'left',
                                label: column
                            })
                        }

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
