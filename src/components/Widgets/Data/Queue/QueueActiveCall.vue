<template>
    <div>
        <data-table
            v-if="!loading"
            :tableData="fetchTableData"
            :editable="editable"
            :columns="columns"
            :stripe="stripe"
            :border="border">
        </data-table>

        {{queueActiveCalls}}


    </div>
</template>
<script>
    import {activeCallColumns} from '@/enum/queueConfigs'
    import DataTable from '@/components/Table/DataTable'

    export default {
        components: {
            DataTable
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
                columns: activeCallColumns,
                border: true,
                stripe: true
            }
        },
        computed: {
            queueActiveCalls() {
                return this.$store.state.queues.all.filter((el) => el.Calls.length)
            },

            fetchTableData() {



                return []
            }
        },

    }
</script>
<style lang="scss" scoped>

</style>
