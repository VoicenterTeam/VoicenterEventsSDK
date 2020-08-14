<template>
    <div class="rounded-lg pt-2" v-if="chartVisibility">
        <highcharts :options="chartOptions"
                    class="chart-content_wrapper"/>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Highcharts from 'highcharts'
    import { Chart } from 'highcharts-vue'
    import chartConfig from './Configs/TimeLine'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import { getWidgetData } from '@/services/widgetService'
    import { getDefaultTimeDelay } from '@/enum/generic'
    import bus from '@/event-bus/EventBus'

    export default {
        name: 'TimeLineChart',
        components: {
            Highcharts,
            highcharts: Chart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                chartVisibility: true,
                chartOptions: {},
                fetchDataInterval: null,
            }
        },
        methods: {
            async getWidgetData() {
                try {
                    let widgetDataType = this.data.DataTypeID
                    let Data = await getWidgetData(this.data)

                    if (!Data) {
                        return
                    }

                    let chartData = get(Data, '0', { series: [] })

                    if (widgetDataType === widgetDataTypes.EXTERNAL_DATA_TYPE_ID) {
                        chartData = { series: Data }
                    } else {
                        chartData = get(Data, '0', { series: [] })
                    }
                    let chartType = ''

                    if (widgetDataType === widgetDataTypes.LINES_TYPE_ID) {
                        chartType = 'line'
                    } else if (widgetDataType === widgetDataTypes.BARS_WITH_LINES_TYPE_ID) {
                        chartType = 'column'
                    } else if (widgetDataType === widgetDataType.CHART_QUEUE) {
                        chartData = {
                            ...chartData,
                            ...chartConfig.yAxisConfig,
                        }
                    }

                    let data = {
                        Order: 6,
                        chart: {
                            type: chartType,
                            marginTop: 45,
                        },
                        tooltip: {
                            formatter: function () {
                                return `<p style="font-size: 16px; color: ${this.point.color}; margin-top: 10px">${this.point.y}</p>`
                            },
                            backgroundColor: '#ffffff',
                            borderColor: '#ffffff',
                            boxShadow: '0 10px 15px 0 rgba(143, 149, 163, 0.38)',
                            borderRadius: 10,
                        },
                        ...chartData,
                    }

                    this.addLegendToChart(data)
                    this.chartOptions = data
                    this.reDrawChart()
                } catch (e) {
                    console.warn(e)
                    let status = get(e, 'response.status')
                    if (status === 400) {
                        let refreshDelay = getDefaultTimeDelay()
                        this.$set(this.data, 'DefaultRefreshInterval', refreshDelay)
                    }
                }
            },
            addLegendToChart(chart) {
                if (!chart.legend) {
                    chart.legend = {
                        enabled: true,
                    }
                } else {
                    chart.legend.enabled = true
                }
                return chart
            },
            triggerResizeEvent() {
                bus.$on('widget-resized', (widgetID) => {
                    if (this.data.WidgetID.toString() !== widgetID.toString()) {
                        return
                    }
                    this.reDrawChart()
                })
            },
            reDrawChart() {
                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            },
        },
        mounted() {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }
            this.triggerResizeEvent()
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.getWidgetData()
                },
            },
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
<style lang="scss" scoped>
    .chart-content_wrapper {
        max-height: 400px;
    }
</style>
