<template>
    <div class="rounded-lg pt-2"
         v-if="chartVisibility">
        <highcharts
            ref="queue-chart"
            class="chart-content_wrapper"
            :options="chartData"
            :updateArgs="[true, true]"
        />
    </div>
</template>
<script>
    import { Dialog } from 'element-ui'
    import { Chart } from 'highcharts-vue'
    import bus from '@/event-bus/EventBus'
    import queueMixin from '@/mixins/queueMixin'
    import chartConfig from './Configs/TimeLine'
    import { getServerTimeOffset } from '@/enum/generic'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    import {DEFAULT_CHART_SERIES_LINES_KEYS} from '@/enum/queueConfigs'
    import get from 'lodash/get'

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
            agents() {
                return this.$store.state.extensions.extensions
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
                if (!this.agents.length) return

                if (!this.chartData.series.length) {
                    this.chartVisibility = false
                }

                const newTime = new Date()
                const queues = this.filteredQueues
                const currentTime = newTime.getTime() + getServerTimeOffset();
                const columns = Math.floor(this.showTime / this.timeout)
                const agentsInCall = []
                const agentsWithACallInHold = []
                const agentsInQueueCalls = []
                const queueCalls = []
                const agentsInStatuses = Object.fromEntries(this.accountStatuses.map(({StatusID}) => [StatusID, {data: []}]))

                let minJoinTimeStamp = currentTime / 1000

                queues.forEach((queue) => {
                    queue.Calls.forEach((call) => {
                        if (call.JoinTimeStamp < minJoinTimeStamp) {
                            queueCalls.push(call)

                            minJoinTimeStamp = call.JoinTimeStamp
                        }
                    })
                })

                let maxWaitingTime = queueCalls.length > 0 ? (Math.floor(newTime.getTime() / 1000) + getServerTimeOffset() / 1000 - minJoinTimeStamp) : 0

                this.chartDataLogs[DEFAULT_CHART_SERIES_LINES_KEYS.MAX_WAITING_TIME.key].data.push({
                    x: currentTime,
                    y: maxWaitingTime,
                    toTime: maxWaitingTime,
                })

                this.agents.forEach(agent => {
                    if (agent.calls.length > 0) {
                        if (agent.calls.filter((call) => call.answered && call.callstatus !== this.HOLD_STATUS).length) {
                            agentsInCall.push(agent)
                        }
                        if (agent.calls.filter((call) => call.answered && call.callstatus === this.HOLD_STATUS).length) {
                            agentsWithACallInHold.push(agent)
                        }
                    }

                    if (!agentsInStatuses[agent.representativeStatus]) return

                    agentsInStatuses[agent.representativeStatus].data.push(agent)
                })

                Object.entries(agentsInStatuses).forEach(([StatusID, {data}]) => {
                    this.chartDataLogs[StatusID].data.push({
                        x: currentTime,
                        y: data.length,
                        agents: data,
                    });
                })

                this.chartDataLogs[DEFAULT_CHART_SERIES_LINES_KEYS.QUEUE_CALLS.key].data.push({
                    x: currentTime,
                    y: queueCalls.length,
                    agents: agentsInQueueCalls
                })

                this.chartDataLogs[DEFAULT_CHART_SERIES_LINES_KEYS.AGENTS_IN_CALL.key].data.push({
                    x: currentTime,
                    y: agentsInCall.length,
                    agents: agentsInCall,
                })

                this.chartDataLogs[DEFAULT_CHART_SERIES_LINES_KEYS.AGENTS_ON_HOLD.key].data.push({
                    x: currentTime,
                    y: agentsWithACallInHold.length,
                    agents: agentsWithACallInHold,
                })

                const series = Object.values(this.chartDataLogs)
                let xAxis = {
                    type: 'datetime',
                    tickPixelInterval: 150
                }

                if (series[0].data.length >= columns) {
                    xAxis = {
                        ...xAxis,
                        min: (new Date()).setMinutes(newTime.getMinutes() - 1) + getServerTimeOffset(),
                        max: currentTime
                    }
                }

                this.chartData = {
                    title: {
                        text: this.$t('queue.chart.title'),
                    },
                    xAxis,
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
                    series,
                    legend: {
                        enabled: true,
                    },
                }

                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            },
            setDefaultChartData() {
                const showSerie = (serieKey) => {
                    if (this.data.WidgetLayout.showSeries) {
                        return this.data.WidgetLayout.showSeries.includes(serieKey);
                    }
                }

                this.chartDataLogs = {
                    ...Object.fromEntries(Object.values(DEFAULT_CHART_SERIES_LINES_KEYS).map((DEFAULT_CHART_SERIE) => {
                        if (DEFAULT_CHART_SERIE.serieType === 'column') {
                            return [
                                DEFAULT_CHART_SERIE.key,
                                {
                                    visible: showSerie(DEFAULT_CHART_SERIE.key),
                                    name: DEFAULT_CHART_SERIE.name,
                                    type: DEFAULT_CHART_SERIE.serieType,
                                    color: get(this.data, `WidgetLayout.colors.${DEFAULT_CHART_SERIE.colorVar}`, DEFAULT_CHART_SERIE.colorDefault),
                                    data: [],
                                    pointWidth: 20,
                                    stack: 0,
                                    yAxis: 1,
                                }
                            ]
                        } else {
                            return [
                                DEFAULT_CHART_SERIE.key,
                                {
                                    visible: showSerie(DEFAULT_CHART_SERIE.key),
                                    name: DEFAULT_CHART_SERIE.name,
                                    type: DEFAULT_CHART_SERIE.serieType,
                                    color: get(this.data, `WidgetLayout.colors.${DEFAULT_CHART_SERIE.colorVar}`, DEFAULT_CHART_SERIE.colorDefault),
                                    data: [],
                                    yAxis: 0,
                                }
                            ]
                        }
                    })),
                    ...Object.fromEntries(this.accountStatuses.map(accountStatus => {
                        return [
                            accountStatus.StatusID,
                            {
                                visible: showSerie(accountStatus.StatusID),
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
                }
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

                this.updateChartData()

                this.fetchDataInterval = setInterval(() => {
                    this.updateChartData()
                }, this.timeout)
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

            this.triggerResizeEvent()

            this.accountStatuses = this.$store.getters['entities/accountStatuses']

            this.setDefaultChartData()
            this.getWidgetDataWithRefreshInterval()
        },
        watch: {
            data() {
                this.chartVisibility = false

                if (!this.data.WidgetLayout.showQueues) {
                    this.$set(this.data.WidgetLayout, 'showQueues', this.allQueues.map((el) => el.QueueID))
                }

                this.triggerResizeEvent()

                this.accountStatuses = this.$store.getters['entities/accountStatuses']

                this.setDefaultChartData()
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
