<template>
    <div>
        <data-table
            :tableData="fetchTableData"
            :editable="editable"
            :columns="columns"
            :stripe="stripe"
            :border="border">
            <template v-slot:WaitingTime="{row}">
                <waiting-time :key="row.IvrUniqueID" :call="row.Call" :textColor="'text-white'"/>
            </template>
        </data-table>
    </div>
</template>
<script>
    import orderBy from 'lodash/orderBy'
    import WaitingTime from './WaitingTime'
    import DataTable from '@/components/Table/DataTable'
    import {activeCallColumns} from '@/enum/queueConfigs'

    export default {
        components: {
            DataTable,
            WaitingTime,
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
            queueWithActiveCalls() {
                return this.$store.state.queues.all.filter((el) => el.Calls.length)
            },
            fetchTableData() {
                let data = []
                this.queueWithActiveCalls.forEach((queue) => {
                    queue.Calls.forEach((call) => {
                        data.push({
                            QueueName: queue.QueueName,
                            CallerNumber: queue.CallerPhone || ' - ',
                            CallerName: call.CallerName,
                            Call: call
                        })
                    })
                })
                return orderBy(data, function(q) { return q.Call.JoinTimeStamp}, ['asc']);
            }
        },
    }
</script>
