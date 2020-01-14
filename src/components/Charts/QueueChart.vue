<template>
    <div>
        <div class="flex flex-row md:items-center justify-between">
            <div class="flex">
                <p class="text-main-2xl"
                   :class="$rtl.isRTL ? 'ml-5' : 'mr-5'">
                    {{data.Title}}
                </p>
            </div>
            <div v-if="queues.length" class="flex cursor-pointer outline-none pr-12" :class="responsiveClass"
                 @click="showConfigDialog()">
                <el-tooltip class="item" effect="dark" :content="$t('queue.config.dialog')"
                            placement="bottom">
                    <IconSettings class="text-primary"/>
                </el-tooltip>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 mt-4" v-if="chartVisibility">
            <highcharts :options="chartOptions"/>
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
</template>
<script>
    import colors from '@/enum/colors'
    import {Chart} from 'highcharts-vue'
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
            },
            data: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                chartVisibility: true,
                fetchDataInterval: null,
                chartTitle: this.$t('queue.chart.title'),
                chartData: {
                    title: {
                        text: this.$t('queue.chart.title'),
                    },
                    xAxis: {
                        type: 'datetime',
                    },
                    ...chartConfig.queueChartYAxisConfig,
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    series: [
                        {
                            name: 'Max Waiting time',
                            data: [],
                            yAxis: 0,
                        },
                        {
                            name: 'Queue Calls',
                            data: [],
                            yAxis: 0,
                        },
                        {
                            name: 'Agents available',
                            type: 'column',
                            color: colors.LOGIN_COLOR,
                            pointWidth: 20,
                            stack: 0,
                            yAxis: 1,
                            data: [],
                        },
                        {
                            name: 'Agents in Call',
                            type: 'column',
                            color: colors.LIGHT_GREEN,
                            yAxis: 1,
                            pointWidth: 20,
                            stack: 0,
                            data: [],
                        },
                        {
                            name: 'Agents in administrative break',
                            type: 'column',
                            color: colors.ADMINISTRATIVE_COLOR,
                            pointWidth: 20,
                            stack: 0,
                            yAxis: 1,
                            data: [],
                        },
                        {
                            name: 'Agents in Break',
                            type: 'column',
                            color: colors.PRIVATE_COLOR,
                            pointWidth: 20,
                            stack: 0,
                            yAxis: 1,
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
                this.fetchDataInterval = setInterval(() => {
                    this.updateChartData()
                }, 5000)

                return this.chartData
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
            updateChartData() {
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
            this.$nextTick(this.updateChartData)
        },
        watch: {
            data() {
                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            }
        },
    }
</script>
