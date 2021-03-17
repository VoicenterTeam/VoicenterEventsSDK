<template>
    <div class="rounded-lg pt-2"
         v-if="chartVisibility">
        <highcharts :options="chartOptions"
                    :callback="onInitChartCallback"
                    class="chart-content_wrapper"/>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Highcharts from 'highcharts'
    import { Chart } from 'highcharts-vue'
    import bus from '@/event-bus/EventBus'
    import Area from 'highcharts/modules/accessibility'
    import { getDefaultTimeDelay } from '@/enum/generic'
    import { getWidgetData } from '@/services/widgetService'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    
    Area(Highcharts);
    
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
        computed: {
            outgoingAreaColor() {
                return get(this.data.WidgetLayout, 'colors.outgoing', '#61B5FE')
            },
            incomingAreaColor() {
                return get(this.data.WidgetLayout, 'colors.incoming', '#49CA6D')
            },
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
                    
                    let Data = await getWidgetData(this.data)
                    this.chartOptions = get(Data, '0', {})
                    
                    this.chartOptions['colors'] = [
                        this.incomingAreaColor,
                        this.outgoingAreaColor,
                    ]
                    
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
