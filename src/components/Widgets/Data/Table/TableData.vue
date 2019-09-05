<template>
    <data-table
        :data="data"
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
</template>
<script>

    import DataTable from "@/components/Table/DataTable";
    import UserStatus from "./UserStatus";
    import StatusDuration from "./StatusDuration";
    import statusTypes from "@/enum/statusTypes";

    export default {
        components: {
            DataTable,
            UserStatus,
            StatusDuration
        },
        props: {
            data: {
                type: Object,
                default: () => ({
                    tableData: [],
                    columns: []
                })
            },
            border: {
                type: Boolean,
                default: true
            },
            stripe: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                statusMappings: statusTypes,
            }
        },
        computed: {
            extensions() {
                return this.$store.state.extensions.extensions
            }
        },
        methods: {
            userExtension(userId, rowIndex) {
                return this.extensions.filter(e => e.userID === userId)[rowIndex]
            },
            getCellStyle({row, column, rowIndex}) {

                if (column.property === 'status' || column.property === 'status_duration') {

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
            getCellClassName({row, column, rowIndex, columnIndex}) {
                if (column.property === 'status' || column.property === 'status_duration') {
                    return 'text-white'
                }
            }
        }
    }

</script>

<style lang="scss">
    td.text-white > .cell {
        color: white;
    }
</style>
