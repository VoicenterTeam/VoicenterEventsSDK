<template>
    <div class="rounded-lg pt-2"
         v-if="chartVisibility">
        <highcharts
            ref="funnel-3d-chart"
            class="chart-content_wrapper"
            :options="chartOptions"
            :callback="onInitChartCallback"
            :updateArgs="[true, true]"
        />
    </div>
</template>
<script>
    import Highcharts from 'highcharts'
    import bus from '@/event-bus/EventBus'
    import { Chart } from 'highcharts-vue'
    import Highcharts3d from 'highcharts/highcharts-3d'
    import { getWidgetData } from '@/services/widgetService'
    import HighchartsCylinder from 'highcharts/modules/cylinder'
    import funnel3dConfig from '@/components/Charts/Configs/funnel3D'
    import HighchartsFunnel3d from 'highcharts/modules/funnel3d'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    
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
                const divToPrint = this.$el.children[0]
                const newWin = window.open();
                newWin.document.write(divToPrint.innerHTML);
                newWin.document.close();
                newWin.focus();
                newWin.print();
            },
            tryDownloadChart(type) {
                this.$refs['funnel-3d-chart'].chart.exportChart({
                    type: type,
                })
            },
            async getWidgetData() {
                try {
                    const Data = await getWidgetData(this.data)

                    this.chartOptions = {
                        series: Data,
                        ...funnel3dConfig,
                    }
                    this.reDrawChart()
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
