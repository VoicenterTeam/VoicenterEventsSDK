<template>
    <div>
        <data-table
            :border="border"
            :columns="availableColumns"
            :editable="editable"
            :showColumns="visibleColumns"
            :stripe="stripe"
            :tableData="fetchTableData"
            :widgetTitle="data.Title"
            @on-update-layout="onUpdateLayout"
            @sort-change="sortChange">
            <template v-slot:WaitingTime="{row}">
                <waiting-time :call="row.Call" :key="row.Call.ivrid" :textColor="'text-white'"
                              v-if="row.Call && drawRow"/>
            </template>
            <template v-slot:title>
                <base-widget-title :title="data.Title"/>
            </template>
        </data-table>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import orderBy from 'lodash/orderBy'
    import cloneDeep from 'lodash/cloneDeep'
    import WaitingTime from './WaitingTime'
    import {WidgetApi} from '@/api/widgetApi'
    import queueMixin from '@/mixins/queueMixin'
    import DataTable from '@/components/Table/DataTable'
    import {activeCallColumns} from '@/enum/queueConfigs'

    export default {
        mixins: [queueMixin],
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
        data () {
            return {
                activeCallColumns,
                border: true,
                stripe: true,
                width: '30%',
                drawRow: true,
                widget: cloneDeep(this.data),
            }
        },
        computed: {
            fetchTableData () {
                let data = []
                this.filteredQueuesWithActiveCalls.forEach((queue) => {
                    queue.Calls.forEach((call) => {

                        data.push({
                            QueueName: queue.QueueName,
                            CallerNumber: queue.CallerPhone || ' - ',
                            CallerName: call.CallerName,
                            CallerID: call.CallerID,
                            Call: call
                        })
                    })
                })

                return orderBy(data, function (q) {
                    return q.Call.JoinTimeStamp
                }, ['asc']);
            },
            availableColumns () {
                return get(this.widget.WidgetLayout, 'Columns.availableColumns') || activeCallColumns
            },
            visibleColumns () {
                return get(this.widget.WidgetLayout, 'Columns.visibleColumns') || activeCallColumns.map(c => c.prop)
            }
        },
        methods: {
            sortChange () {
                this.drawRow = false
                this.$nextTick(() => {
                    this.drawRow = true
                })
            },
            async onUpdateLayout (data) {
                this.widget.WidgetLayout['Columns'] = data
                await WidgetApi.update(this.widget)
                this.widget = await WidgetApi.find(this.widget.WidgetID)
            }
        },
        mounted () {
            if (!this.data.WidgetLayout.showQueues) {
                this.$set(this.data.WidgetLayout, 'showQueues', this.allQueues.map((el) => el.QueueID))
            }
        },
    }
</script>
