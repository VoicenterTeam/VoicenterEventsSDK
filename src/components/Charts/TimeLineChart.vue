<template>
    <div class="rounded-lg pt-2 h-full" v-if="chartVisibility">
        <highcharts
            ref="time-line-chart"
            class="h-full"
            :options="chartOptions"
            :callback="onInitChartCallback"
            :updateArgs="[true, true]"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { Chart } from 'highcharts-vue'
    import bus from '@/event-bus/EventBus'
    import chartConfig from './Configs/TimeLine'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import { getDefaultTimeDelay } from '@/enum/generic'
    import { getWidgetData } from '@/services/widgetService'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    
    export default {
        mixins: [actionMixin],
        name: 'TimeLineChart',
        components: {
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
                chartInstance: false,
            }
        },
        methods: {
            onInitChartCallback(chart) {
                this.chartInstance = chart
            },
            tryPrintChart() {
                const divToPrint = this.$el.children[0]
                const newWin = window.open();
                newWin.document.write(divToPrint.innerHTML);
                newWin.document.close();
                newWin.focus();
                newWin.print();
            },
            tryDownloadChart(type) {
                this.$refs['time-line-chart'].chart.exportChart({
                    type: type,
                })
            },
            async getWidgetData() {
                try {
                    let widgetDataType = this.data.DataTypeID
                    let Data = await getWidgetData(this.data)
                    
                    if (!Data) {
                        return
                    }
                    const defaultDisplayLegend = this.data.WidgetLayout.displayLegend

                    this.data.WidgetLayout.displayLegend = !!defaultDisplayLegend
                    
                    let chartData = get(Data, '0', { series: [] })
                    chartData.series.map(el => {
                        el.showInLegend = defaultDisplayLegend
                        return el
                    })
                    
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
            getWidgetDataWithRefreshInterval () {
                if (this.fetchDataInterval) {
                    clearInterval(this.fetchDataInterval)
                }
                if (this.data.DefaultRefreshInterval) {
                    this.fetchDataInterval = setInterval(async() => {
                        await this.getWidgetData()
                    }, this.data.DefaultRefreshInterval)
                }
            }
        },
        mounted() {
            this.getWidgetData()
            this.triggerResizeEvent()
            this.reDrawChart()
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.getWidgetDataWithRefreshInterval()
                    if (this.chartOptions) {
                        this.getWidgetData()
                        this.getWidgetDataWithRefreshInterval()
                        this.reDrawChart()
                    }
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
