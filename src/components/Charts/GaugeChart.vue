<template>
    <div class="bg-transparent pt-2 rounded-lg"
         v-if="chartVisibility">
        <highcharts
            ref="gauge-chart"
            class="chart-content_wrapper"
            :options="chartData"
            :callback="onInitChartCallback"
            :updateArgs="[true, true]"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Highcharts from 'highcharts'
    import { Tooltip } from 'element-ui'
    import { Chart } from 'highcharts-vue'
    import bus from '@/event-bus/EventBus'
    import queueMixin from '@/mixins/queueMixin'
    import { TrashIcon } from 'vue-feather-icons'
    import gaugeChartConfig from './Configs/Gauge'
    import { WidgetDataApi } from '@/api/widgetDataApi'
    import highchartsMoreInit from 'highcharts/highcharts-more'
    import solidGaugeInit from 'highcharts/modules/solid-gauge'
    import { isExternalDataWidget } from '@/helpers/widgetUtils'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    
    highchartsMoreInit(Highcharts)
    solidGaugeInit(Highcharts)
    
    export default {
        mixins: [queueMixin, actionMixin],
        components: {
            TrashIcon,
            highcharts: Chart,
            [Tooltip.name]: Tooltip,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                chartVisibility: true,
                chartData: {},
                chartInstance: false,
                fetchDataInterval: null,
            }
        },
        computed: {
            getMaximumRange() {
                return get(this.data, 'WidgetLayout.maximumRange', 0)
            },
            getLabelFontSize() {
                return get(this.data, 'WidgetLayout.labelFontSize', 16)
            },
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
                this.$refs['gauge-chart'].chart.exportChart({
                    type: type,
                })
            },
            async chartOptions() {
                if (isExternalDataWidget(this.data)) {
                    let data = await WidgetDataApi.getExternalData(this.data.EndPoint)
                    this.chartData = { ...gaugeChartConfig, ...{ series: data } }
                } else {
                    this.chartData = this.getAgentsData()
                }
                
                this.reDrawChart()
            },
            getAgentsData() {
                let queuesCount = this.getMaximumRange || this.allQueues.length
                
                let range = {
                    min: 0,
                    max: queuesCount,
                }
                
                let stops = [
                    [0, '#55BF3B'],
                    [queuesCount / 2 + 0.1, '#DDDF0D'],
                    [queuesCount, '#DF5353'],
                ]
                
                const labelFontSize = this.getLabelFontSize
                
                let yAxisConfig = {
                    ...gaugeChartConfig.yAxis,
                    ...this.data.yAxis,
                    ...range,
                    stops,
                    labels: {
                        y: labelFontSize * 0.8,
                        style: {
                            fontSize: labelFontSize,
                        },
                    },
                }
                
                const allQueueCalls = this.allQueueCalls.length
                
                const labelStyle = `style="font-size:${labelFontSize}px"`
                
                this.data.series = [{
                    data: [allQueueCalls],
                    dataLabels: {
                        style: {
                            fontSize: labelFontSize,
                        },
                        y: -35,
                        format:
                            '<div style="text-align:center">' +
                            `<span ${labelStyle}>{y}</span><br/>` +
                            '</div>',
                    },
                }]
                
                return { ...gaugeChartConfig, ...this.data, ...{ yAxis: yAxisConfig } }
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
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.chartOptions()
                },
            },
            allQueues() {
                this.chartOptions()
            },
        },
        mounted() {
            if (!this.data.WidgetLayout.showQueues) {
                this.$set(this.data.WidgetLayout, 'showQueues', this.allQueues.map((el) => el.QueueID))
            }
            this.triggerResizeEvent()
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.chartOptions()
                }, this.data.DefaultRefreshInterval)
            }
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
<style lang="scss">
.gouge-wrapper {
    max-height: 300px;
}
</style>
