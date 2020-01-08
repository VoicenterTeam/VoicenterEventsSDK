<template>
    <div>
        <data-table
            :tableData="fetchTableData"
            :editable="editable"
            :columns="availableColumns"
            :showColumns="visibleColumns"
            :stripe="stripe"
            @sort-change="sortChange"
            @on-update-layout="onUpdateLayout"
            :border="border">
            <template v-slot:WaitingTime="{row}">
                <waiting-time v-if="drawRow" :key="row.IvrUniqueID" :call="row.Call" :textColor="'text-white'"/>
            </template>
            <template v-slot:additional-data>
                <div class="flex cursor-pointer outline-none"
                     @click="showDialog">
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
            :showQueues=showQueues
            @on-update="updateTable"
            :width="width"
            :visible.sync="showConfigDialog">
        </config-dialog>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Tooltip} from 'element-ui'
    import orderBy from 'lodash/orderBy'
    import cloneDeep from 'lodash/cloneDeep'
    import WaitingTime from './WaitingTime'
    import ConfigDialog from './ConfigDialog'
    import {WidgetApi} from '@/api/widgetApi'
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
                activeCallColumns,
                border: true,
                stripe: true,
                showConfigDialog: false,
                width: '30%',
                showQueues: [],
                initialConfig: true,
                drawRow: true,
                widget: cloneDeep(this.data)
            }
        },
        computed: {
            queueWithActiveCalls() {
                return this.$store.state.queues.all.filter((el) => el.Calls.length)
            },
            filteredQueues() {
                if (this.showQueues && !this.initialConfig) {
                    return this.queueWithActiveCalls.filter(e => this.showQueues.includes(e.QueueID))
                }
                return this.queueWithActiveCalls
            },
            fetchTableData() {
                let data = []
                this.filteredQueues.forEach((queue) => {
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
            },
            availableColumns() {
                return get(this.widget.WidgetLayout, 'Columns.availableColumns') || activeCallColumns
            },
            visibleColumns() {
                return get(this.widget.WidgetLayout, 'Columns.visibleColumns') || activeCallColumns.map(c => c.prop)
            }
        },
        methods: {
            updateTable(queues) {
                this.initialConfig = false
                this.showQueues = queues
            },
            showDialog() {
                if (this.initialConfig) {
                    this.showQueues = this.queueWithActiveCalls.map((el) => el.QueueID)
                }
                this.showConfigDialog = true
            },
            sortChange() {
                this.drawRow = false
                this.$nextTick(() => {
                    this.drawRow = true
                })
            },
            async onUpdateLayout(data) {
                this.widget.WidgetLayout['Columns'] = data
                await WidgetApi.update(this.widget)
                this.widget = await WidgetApi.find(this.widget.WidgetID)
            }
        }
    }
</script>
