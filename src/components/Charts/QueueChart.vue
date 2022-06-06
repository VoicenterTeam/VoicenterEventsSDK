<template>
    <div class="rounded-lg pt-2"
         v-if="chartVisibility">
        <highcharts
            ref="queue-chart"
            class="chart-content_wrapper"
            :options="chartData"
            :callback="onInitChartCallback"
            :updateArgs="[true, true]"
        />
    </div>
</template>
<script>
    import colors from '@/enum/colors'
    import { Dialog } from 'element-ui'
    import { Chart } from 'highcharts-vue'
    import bus from '@/event-bus/EventBus'
    import queueMixin from '@/mixins/queueMixin'
    import chartConfig from './Configs/TimeLine'
    import { getServerTimeOffset } from '@/enum/generic'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    import { administrativeStatuses, breakStatuses, LOGIN_STATUS, LOGOUT_STATUS } from '@/enum/extensionStatuses'

    export default {
        mixins: [queueMixin, actionMixin],
        components: {
            highcharts: Chart,
            [Dialog.name]: Dialog,
        },
        props: {
            editable: {
                type: Boolean,
                default: false,
            },
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                chartInstance: false,
                chartVisibility: true,
                fetchDataInterval: null,
                chartTitle: this.$t('queue.chart.title'),
                HOLD_STATUS: 'Hold',
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
                            stacking: 'normal',
                        },
                        series: {
                            events: {
                                hide: this.legendItemClick,
                                show: this.legendItemClick
                            }
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
                            color: colors.QUEUE_OTHER_COLOR,
                        },
                        {
                            name: 'Agents available',
                            type: 'column',
                            color: colors.QUEUE_LOGIN_COLOR,
                            pointWidth: 20,
                            stack: 0,
                            yAxis: 1,
                            data: [],
                        },
                        {
                            name: 'Agents in Call',
                            type: 'column',
                            color: colors.QUEUE_LIGHT_GREEN,
                            yAxis: 1,
                            pointWidth: 20,
                            stack: 0,
                            data: [],
                        },
                        {
                            name: 'Agents in administrative break',
                            type: 'column',
                            color: colors.QUEUE_ADMINISTRATIVE_COLOR,
                            pointWidth: 20,
                            stack: 0,
                            yAxis: 1,
                            data: [],
                        },
                        {
                            name: 'Agents in Break',
                            type: 'column',
                            color: colors.QUEUE_PRIVATE_COLOR,
                            pointWidth: 20,
                            stack: 0,
                            yAxis: 1,
                            data: [],
                        },
                        {
                            name: 'Agent with calls in Hold',
                            type: 'column',
                            color: colors.QUEUE_TEAM_MEETING_COLOR,
                            yAxis: 1,
                            pointWidth: 20,
                            stack: 0,
                            data: [],
                        },
                    ],
                    legend: {
                        enabled: true,
                    },
                },
                showManageQueuesDialog: false,
                width: '50%',
                timeout: 5000,
                showTime: 60000
            };
        },
        computed: {
            agentsOnline() {
                return this.$store.state.extensions.extensions.filter((e) => e.representativeStatus !== LOGOUT_STATUS)
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
            legendItemClick({target}) {
                const index = target.index

                this.chartData.series[index].visible = target.visible
            },
            onInitChartCallback(chart) {
                this.chartInstance = chart

                if (this.data.WidgetLayout.showSeries) {
                    this.chartData.series.forEach((serie, index) => {
                        this.chartData.series[index].visible = this.data.WidgetLayout.showSeries.includes(index);
                    })
                }
            },
            async tryPrintChart() {
                const divToPrint = this.$el.children[0]
                const newWin = window.open();
                newWin.document.write(divToPrint.innerHTML);
                newWin.document.close();
                newWin.focus();

                await this.$nextTick();
                newWin.print();
            },
            tryDownloadChart(type) {
                this.$refs['queue-chart'].chart.exportChart({
                    type: type,
                })
            },
            async updateChartData() {
                const newTime = new Date()
                let queues = this.filteredQueues

                let minJoinTimeStamp = newTime.getTime() + getServerTimeOffset() / 1000
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
                let maxWaitingTime = queueCalls > 0 ? (Math.floor(newTime.getTime() / 1000) + getServerTimeOffset() / 1000 - minJoinTimeStamp) : 0

                let currentTime = newTime.getTime();

                const columns = Math.floor(this.showTime / this.timeout)

                if (this.chartData.series[0].data.length >= columns) {
                    this.chartData.xAxis = {
                        ...this.chartData.xAxis,
                        ...{
                            min: (new Date()).setMinutes(newTime.getMinutes() - 1) + getServerTimeOffset(),
                            max: newTime.getTime() + getServerTimeOffset(),
                        },
                    }
                }

                let agentsInCall = []
                let agentsWithACallInHold = []

                let agentsAvailable = []
                let agentsInAdministrativeBreak = []
                let agentsInBreak = []

                agentsOnline.forEach((agent) => {

                    if (agent.calls.length > 0) {
                        if (agent.calls.filter((call) => call.answered && call.callstatus !== this.HOLD_STATUS).length) {
                            agentsInCall.push(agent)
                        }
                        if (agent.calls.filter((call) => call.answered && call.callstatus === this.HOLD_STATUS).length) {
                            agentsWithACallInHold.push(agent)
                        }
                    } else {
                        if (agent.representativeStatus === LOGIN_STATUS) {
                            agentsAvailable.push(agent)
                        }
                        if (administrativeStatuses.includes(agent.representativeStatus)) {
                            agentsInAdministrativeBreak.push(agent)
                        }
                        if (breakStatuses.includes(agent.representativeStatus)) {
                            breakStatuses.push(agent)
                        }
                    }
                });

                this.chartData.series[0].data.push({
                    x: currentTime,
                    y: maxWaitingTime,
                    toTime: maxWaitingTime,
                });

                [
                    queueCalls,
                    agentsAvailable,
                    agentsInCall,
                    agentsInAdministrativeBreak,
                    agentsInBreak,
                    agentsWithACallInHold,
                ].forEach((agents, index) => {
                    this.chartData.series[index + 1].data.push({
                        x: currentTime,
                        y: agents.length,
                        agents: agents,
                    });
                })
            },
            triggerResizeEvent() {
                bus.$on('widget-resized', (widgetID) => {
                    if (this.data.WidgetID.toString() !== widgetID.toString()) {
                        return;
                    }
                    this.reDrawChart()
                });
            },
            reDrawChart() {
                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            },
            getWidgetDataWithRefreshInterval () {
                if (this.fetchDataInterval) {
                    clearInterval(this.fetchDataInterval)
                }
                if (this.data.DefaultRefreshInterval) {
                    this.fetchDataInterval = setInterval(async() => {
                        await this.updateChartData()
                    }, this.data.DefaultRefreshInterval)
                }
            }
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
        mounted() {
            if (!this.data.WidgetLayout.showQueues) {
                this.$set(this.data.WidgetLayout, 'showQueues', this.allQueues.map((el) => el.QueueID))
            }
            this.$nextTick(this.updateChartData)
            this.triggerResizeEvent()
    },
        watch: {
            data() {
                this.reDrawChart()
                this.getWidgetDataWithRefreshInterval()
            }
        }
    }
</script>
<style lang="scss" scoped>
.chart-content_wrapper {
    max-height: 400px;
}
</style>
