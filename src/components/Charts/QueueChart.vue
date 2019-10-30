<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)">
        <div>
            <div class="flex flex-row md:items-center justify-between my-4">
                <div class="flex">
                    <p class="text-2xl font-semibold"
                       :class="$rtl.isRTL ? 'ml-5' : 'mr-5'">
                        {{data.caption}}
                    </p>
                </div>
                <div v-if="queues.length" class="flex cursor-pointer outline-none pr-12" :class="responsiveClass"
                     @click="showConfigDialog()">
                    <el-tooltip class="item" effect="dark" :content="$t('queue.config.dialog')"
                                placement="bottom">
                        <IconSettings class="text-primary"></IconSettings>
                    </el-tooltip>
                </div>
            </div>
            <div class="bg-white p-4 rounded-lg py-4 my-4">
                <highcharts :options="chartOptions"></highcharts>
            </div>
            <queue-config-dialog
                    v-if="showManageQueuesDialog"
                    :queues="queues"
                    :showQueues=showQueues
                    :showSeries=showSeries
                    :width="width"
                    @on-update="((config)=>updateChart(config.queues, config.series))"
                    :visible.sync="showManageQueuesDialog">
            </queue-config-dialog>
        </div>
    </div>
</template>
<script>
    import {Chart} from 'highcharts-vue'
    import cloneDeep from 'lodash/cloneDeep'
    import {Dialog, Tooltip} from 'element-ui'
    import chartConfig from './Configs/TimeLine'
    import {ISRAEL_TIMEZONE_OFFSET} from '@/enum/generic'
    import QueueConfigDialog from './Configs/QueueConfigDialog'
    import {administrativeStatuses, breakStatuses, LOGOUT_STATUS, LOGIN_STATUS} from '@/enum/extensionStatuses'

    export default {
        components: {
            highcharts: Chart,
            [Dialog.name]: Dialog,
            [Tooltip.name]: Tooltip,
            QueueConfigDialog,
        },
        props: {
            editable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                fetchDataInterval: null,
                chartData: {
                    yAxis: {
                        min: 0,
                        max: 100,
                    },
                    series: [
                        {
                            data: [],
                        },
                        {
                            data: [],
                        },
                        {
                            data: [],
                        },
                        {
                            data: [],
                        },
                        {
                            data: [],
                        },
                        {
                            data: [],
                        }
                    ],
                    legend: {
                        enabled: false,
                    }
                },
                showManageQueuesDialog: false,
                width: '50%',
                initialConfig: true,
                showQueues: [],
                showSeries: [0, 1, 2, 3, 4, 5],
                loading: false
            };
        },
        computed: {
            queues() {
                return this.$store.state.queues.all
            },
            filteredQueues() {
                if (this.showQueues && !this.initialConfig) {
                    return this.queues.filter(e => this.showQueues.includes(e.QueueID))
                }
                return this.queues
            },
            agentsOnline() {
                return this.$store.state.extensions.extensions.filter((e) => e.representativeStatus !== LOGOUT_STATUS)
            },

            chartOptions() {

                if (this.fetchDataInterval) {
                    clearInterval(this.fetchDataInterval)
                }

                let queues = this.filteredQueues

                let minJoinTimeStamp = (new Date()).getTime() + ISRAEL_TIMEZONE_OFFSET / 1000
                let queueCalls = 0

                queues.forEach((queue) => {
                    queue.Calls.forEach((call) => {
                        if (call.JoinTimeStamp < minJoinTimeStamp) {
                            minJoinTimeStamp = call.JoinTimeStamp
                            queueCalls++
                        }
                    })
                })

                let agentsOnline = this.agentsOnline

                this.fetchDataInterval = setInterval(() => {
                    let maxWaitingTime = queueCalls > 0 ? (parseInt((new Date()).getTime() / 1000) + ISRAEL_TIMEZONE_OFFSET / 1000 - minJoinTimeStamp) : 0
                    let currentTime = (new Date()).getTime() + ISRAEL_TIMEZONE_OFFSET;

                    if (this.chartData.series[0].data.length > 11) {
                        this.chartData.xAxis = {
                            ...this.chartData.xAxis,
                            ...{
                                min: new Date().setMinutes(new Date().getMinutes() - 1) + ISRAEL_TIMEZONE_OFFSET,
                                max: new Date().getTime() + ISRAEL_TIMEZONE_OFFSET,
                            }
                        }
                    }

                    let agentsAvailable = agentsOnline.filter((e) => e.representativeStatus === LOGIN_STATUS).length
                    let agentsInCall = agentsOnline.filter((e) => e.calls.length > 0).length
                    let agentsInAdministrativeBreak = agentsOnline.filter((e) => e.calls.length === 0 && administrativeStatuses.includes(e.representativeStatus)).length
                    let agentsInBreak = agentsOnline.filter((e) => e.calls.length === 0 && breakStatuses.includes(e.representativeStatus)).length;

                    [
                        maxWaitingTime,
                        queueCalls,
                        agentsAvailable,
                        agentsInCall,
                        agentsInAdministrativeBreak,
                        agentsInBreak,
                    ].forEach((el, index) => {
                        this.chartData.series[index].data.push({
                            x: currentTime,
                            y: el
                        });
                    })
                }, 5000)
                this.chartData.legend.enabled = false
                return {...this.chartData, ...chartConfig.queueChartYAxisConfig}
            },
            responsiveClass() {
                if (this.editable && this.$rtl.isRTL) {
                    return 'pl-24'
                }
                if (this.$rtl.isRTL) {
                    return 'pl-24'
                }
                if (this.editable) {
                    return 'pr-24'
                }
            },
        },
        methods: {
            updateChart(queues, series) {
                this.initialConfig = false
                this.showQueues = queues
                this.showSeries = series

                this.chartData.series.forEach((serie, index) => {
                    this.chartData.series[index].visible = this.showSeries.includes(index);
                })
            },
            showConfigDialog() {
                if (this.initialConfig) {
                    this.showQueues = this.queues.map((el) => el.QueueID)
                }
                this.showManageQueuesDialog = true
            }
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
        mounted() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 6000)
        }
    }
</script>
