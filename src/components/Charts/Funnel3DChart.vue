<template>
    <div class="rounded-lg pt-2"
         v-if="chartVisibility">
        <highcharts :options="chartOptions"
                    :callback="onInitChartCallback"
                    class="chart-content_wrapper"/>
    </div>
</template>
<script>
    import Highcharts from 'highcharts'
    import { Chart } from 'highcharts-vue'
    import { getWidgetData } from '@/services/widgetService'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    import Highcharts3d from 'highcharts/highcharts-3d'
    import HighchartsCylinder from 'highcharts/modules/cylinder'
    import HighchartsFunnel3d from 'highcharts/modules/funnel3d'
    import bus from '@/event-bus/EventBus'
    
    Highcharts3d(Highcharts)
    HighchartsCylinder(Highcharts)
    HighchartsFunnel3d(Highcharts)
    
    export default {
        mixins: [actionMixin],
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
                fetchDataInterval: null,
                chartOptions: {},
                chartInstance: false,
            }
        },
        methods: {
            onInitChartCallback(chart) {
                this.chartInstance = chart
            },
            tryPrintChart() {
                this.chartInstance.print()
            },
            tryDownloadChart(type) {
                this.chartInstance.exportChart({
                    type: type,
                })
            },
            async getWidgetData() {
                try {
                    const { Data } = await getWidgetData(this.data)
                    
                    this.chartOptions = {
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: `<b>{point.name}</b> ({point.y:,.0f})`,
                                    allowOverlap: true,
                                    y: 10
                                },
                                neckWidth: "30%",
                                neckHeight: "25%",
                                width: "80%",
                                height: "80%"
                            }
                        },
                        series: [
                            {
                                name: 'Unique users',
                                data: [
                                    ['Website visits', 15654],
                                    ['Downloads', 4064],
                                    ['Requested price list', 1987],
                                    ['Finalized', 846],
                                ],
                            },
                        ],
                        chart: {
                            type: 'funnel3d',
                            options3d: {
                                enabled: true,
                                alpha: 10,
                                depth: 50,
                                viewDistance: 50,
                            },
                        },
                    }
                    
                    this.chartVisibility = false
                    this.$nextTick(() => {
                        this.chartVisibility = true
                    })
                } catch (e) {
                    console.warn(e)
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
        },
        mounted() {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }
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
