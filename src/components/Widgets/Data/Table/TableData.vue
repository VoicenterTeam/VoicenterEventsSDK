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
    import statusTypes from '@/enum/statusTypes'
    import {WidgetDataApi} from '@/api/widgetDataApi'

    const dynamicRows = ['status', 'status_duration']
    const dynamicColumns = [
        {
            'prop': 'status',
            'fixed': false,
            "align": "left",
            'label': 'Status'
        },
        {
            'prop': 'status_duration',
            'fixed': false,
            "align": "left",
            'label': 'Current Status Duration',
            'width': '250px'
        }
    ]

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
                statusMappings: statusTypes,
                tableData: {
                    type: Array,
                    default: () => ([])
                },
                columns: {
                    type: Array,
                    default: () => ([])
                },
                loading: {
                    type: Boolean,
                    default: true
                },
                searchableFields: {
                    type: Array,
                    default: () => ['User', 'Department']
                }
            }
        },
        computed: {
            extensions() {
                return this.$store.state.extensions.extensions
            },
        },
        methods: {
            userExtension(userId, rowIndex) {
                return this.extensions.filter(e => e.userID === userId)[rowIndex]
            },
            getCellStyle({row, column, rowIndex}) {
                if (dynamicRows.includes(column.property)) {
                    let extension = this.userExtension(row.user_id, rowIndex)
                    if (extension) {
                        let data = this.statusMappings[extension.representativeStatus]
                        let color = data.color
                        if (extension.calls.length) {
                            color = '#5EB300'
                        }
                        return {'background-color': color}
                    }
                }
                return {'background-color': 'white'}
            },
            getCellClassName({column}) {
                if (dynamicRows.includes(column.property)) {
                    return 'text-white'
                }
            },
            async getTableData() {

                let data = await WidgetDataApi.getTableData(this.data.WidgetID)
                let columns = [];
                if (data.length) {
                    Object.keys(data[0]).forEach((el) => {
                        columns.push({
                            'prop': el,
                            'fixed': false,
                            "align": "left",
                            'label': el
                        })
                    })
                    columns.splice(3, 0, dynamicColumns[0], dynamicColumns[1])
                    //TODO: update - this is current user_id for testing
                    data[0]['user_id'] = 106576
                }

                this.tableData = data
                this.columns = columns
                this.loading = false
                this.$emit('on-loading', false)
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
