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
    import get from 'lodash/get'

    const DEFAULT_CHART_SERIES_LINES_KEYS = {
        MAX_WAITING_TIME: 'MAX_WAITING_TIME',
        QUEUE_CALLS: 'QUEUE_CALLS',
        AGENTS_ON_HOLD: 'AGENTS_ON_HOLD',
        AGENTS_IN_CALL: 'AGENTS_IN_CALL'
    }

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
                        tickPixelInterval: 150
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
                    series: [],
                    legend: {
                        enabled: true,
                    },
                },
                chartDataLogs: {},
                accountStatuses: [],
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
            updateChartData() {
                this.chartVisibility = false

                const newTime = new Date()
                const queues = this.filteredQueues

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

                let maxWaitingTime = queueCalls > 0 ? (Math.floor(newTime.getTime() / 1000) + getServerTimeOffset() / 1000 - minJoinTimeStamp) : 0

                const currentTime = newTime.getTime() + getServerTimeOffset();

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

                this.chartDataLogs[DEFAULT_CHART_SERIES_LINES_KEYS.QUEUE_CALLS].data.push({
                    x: currentTime,
                    y: queueCalls
                })

                this.chartDataLogs[DEFAULT_CHART_SERIES_LINES_KEYS.MAX_WAITING_TIME].data.push({
                    x: currentTime,
                    y: maxWaitingTime,
                    toTime: maxWaitingTime,
                })

                const agentsInCall = []
                const agentsWithACallInHold = []
                const agentsInStatuses = Object.fromEntries(this.accountStatuses.map(({StatusID}) => [StatusID, {data: []}]))

                this.agentsOnline.forEach(agent => {
                    if (agent.calls.length > 0) {
                        if (agent.calls.filter((call) => call.answered && call.callstatus !== this.HOLD_STATUS).length) {
                            agentsInCall.push(agent)
                        }
                        if (agent.calls.filter((call) => call.answered && call.callstatus === this.HOLD_STATUS).length) {
                            agentsWithACallInHold.push(agent)
                        }
                    }

                    agentsInStatuses[agent.representativeStatus].data.push(agent)
                })

                Object.entries(agentsInStatuses).forEach(([StatusID, {data}]) => {
                    this.chartDataLogs[StatusID].data.push({
                        x: currentTime,
                        y: data.length,
                        agents: data,
                    });
                })

                this.chartDataLogs[DEFAULT_CHART_SERIES_LINES_KEYS.AGENTS_IN_CALL].data.push({
                    x: currentTime,
                    y: agentsInCall.length,
                    agents: agentsInCall,
                })

                this.chartDataLogs[DEFAULT_CHART_SERIES_LINES_KEYS.AGENTS_ON_HOLD].data.push({
                    x: currentTime,
                    y: agentsWithACallInHold.length,
                    agents: agentsWithACallInHold,
                })

                this.updateChartSeriesSeries()

                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            },
            setDefaultChartData() {
                this.chartDataLogs = {
                    ...Object.fromEntries(this.accountStatuses.map(accountStatus => {
                        return [
                            accountStatus.StatusID,
                            {
                                name: accountStatus.Name,
                                type: 'column',
                                color: accountStatus.ColorCode,
                                pointWidth: 20,
                                stack: 0,
                                yAxis: 1,
                                data: [],
                            }
                        ]
                    })),
                    [DEFAULT_CHART_SERIES_LINES_KEYS.MAX_WAITING_TIME]: {
                        name: this.$t('call.maxWaitingTime'),
                        type: 'line',
                        color: get(this.data, 'WidgetLayout.colors.maxWaitingTime', '#61B5FF'),
                        data: [],
                        yAxis: 0,
                    },
                    [DEFAULT_CHART_SERIES_LINES_KEYS.QUEUE_CALLS]: {
                        name: this.$t('call.queueCalls'),
                        type: 'line',
                        data: [],
                        yAxis: 0,
                        color: get(this.data, 'WidgetLayout.colors.queueCalls', '#ED64A6'),
                    },
                    [DEFAULT_CHART_SERIES_LINES_KEYS.AGENTS_ON_HOLD]: {
                        name: this.$t('status.hold'),
                        type: 'column',
                        color: get(this.data, 'WidgetLayout.colors.onHold', '#E53E3E'),
                        pointWidth: 20,
                        stack: 0,
                        yAxis: 1,
                        data: [],
                    },
                    [DEFAULT_CHART_SERIES_LINES_KEYS.AGENTS_IN_CALL]: {
                        name: this.$t('status.incall'),
                        type: 'column',
                        color: get(this.data, 'WidgetLayout.colors.inCall', '#5EB300'),
                        pointWidth: 20,
                        stack: 0,
                        yAxis: 1,
                        data: [],
                    }
                }

                this.updateChartSeriesSeries()
            },
            updateChartSeriesSeries() {
                this.chartData.series = Object.values(this.chartDataLogs)
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

                this.fetchDataInterval = setInterval(async() => {
                    await this.updateChartData()
                }, this.timeout)
            }
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
        created() {
            this.accountStatuses = this.$store.getters['entities/accountStatuses']
            this.setDefaultChartData()
        },
        mounted() {
            if (!this.data.WidgetLayout.showQueues) {
                this.$set(this.data.WidgetLayout, 'showQueues', this.allQueues.map((el) => el.QueueID))
            }

            this.$nextTick(this.updateChartData)
            this.getWidgetDataWithRefreshInterval()
            this.triggerResizeEvent()
        },
        watch: {
            data() {
                this.setDefaultChartData()
                this.reDrawChart()
                this.updateChartData()
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
