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
            <!--            v-if="queueWithActiveCalls.length"-->
            <template v-slot:data-counts>
                <div class="flex cursor-pointer outline-none"
                     @click="showConfigDialog = true">
                    <el-tooltip class="item" effect="dark" :content="$t('queue.config.dialog')"
                                placement="bottom">
                        <IconSettings class="text-primary"/>
                    </el-tooltip>
                </div>
            </template>
        </data-table>
        <config-dialog
            v-if="showConfigDialog"
            :queues="queueWithActiveCalls"
            :width="width"
            :visible.sync="showConfigDialog">
        </config-dialog>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import orderBy from 'lodash/orderBy'
    import WaitingTime from './WaitingTime'
    import ConfigDialog from './ConfigDialog'
    import DataTable from '@/components/Table/DataTable'
    import {activeCallColumns} from '@/enum/queueConfigs'

    export default {
        components: {
            DataTable,
            WaitingTime,
            ConfigDialog,
            [Tooltip.name]: Tooltip,
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
                stripe: true,
                showConfigDialog: false,
                width: '30%'
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
                return orderBy(data, function (q) {
                    return q.Call.JoinTimeStamp
                }, ['asc']);
            }
        },
    }
</script>
