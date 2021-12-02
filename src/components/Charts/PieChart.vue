<template>
    <div class="bg-transparent rounded-lg pt-2"
         v-if="chartVisibility">
        <highcharts
            ref="pie-activity"
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
    import groupBy from 'lodash/groupBy'
    import { Tooltip } from 'element-ui'
    import bus from '@/event-bus/EventBus'
    import { Chart } from 'highcharts-vue'
    import statusTypes from '@/enum/statusTypes'
    import { TrashIcon } from 'vue-feather-icons'
    import { WidgetDataApi } from '@/api/widgetDataApi'
    import extensionMixin from '@/mixins/extensionMixin'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    import { isExternalDataWidget } from '@/helpers/widgetUtils'
    
    export default {
        mixins: [extensionMixin, actionMixin],
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
                HOLD_STATUS: 'Hold',
                chartInstance: false,
                fetchDataInterval: null,
            }
        },
        computed: {
            getLabelFontSize() {
                return get(this.data, 'WidgetLayout.labelFontSize', 16)
            },
            getDataLabelsColor() {
                return get(this.data, 'WidgetLayout.dataLabelsColor', '#000000')
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
                this.$refs['pie-activity'].chart.exportChart({
                    type: type,
                })
            },
            async chartOptions() {
                let { series, colors } = await this.getChartSeriesData()
                
                this.chartData = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie',
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: this.$rtl.isRTL ? '{point.percentage:.1f}% : <b>{point.name}</b>' : '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: 'black',
                                    textOutline: 'none',
                                },
                            },
                        },
                    },
                    series,
                    colors,
                };
                
                this.reDrawChart()
            },
            async getChartSeriesData() {
                let data = []
                const initialColors = []
                if (isExternalDataWidget(this.data)) {
                    data = await WidgetDataApi.getExternalData(this.data.EndPoint)
                } else {
                    data = this.getExtensionsData()
                }
                data.forEach((el) => {
                    initialColors.push(el.color)
                    delete el.color
                    return el
                });
                
                const labelFontSize = this.getLabelFontSize
                const dataLabelsColor = this.getDataLabelsColor
                
                const series = [{
                    name: this.$t('Agents'),
                    colorByPoint: true,
                    data: data,
                    dataLabels: {
                        style: {
                            fontSize: labelFontSize,
                            color: dataLabelsColor,
                        },
                    },
                }]
                const colors = this.getColorOptions(initialColors)
                return {
                    data,
                    series,
                    colors,
                }
            },
            async updateChartSeries() {
                const { colors, series } = await this.getChartSeriesData()
                this.$set(this.chartData, 'colors', colors)
                this.$set(this.chartData, 'series', series)
            },
            getColorOptions(colors) {
                return Highcharts.map(colors, function (color) {
                    return {
                        radialGradient: {
                            cx: 0.5,
                            cy: 0.3,
                            r: 0.7,
                        },
                        stops: [
                            [0, color],
                            [1, Highcharts.color(color).brighten(-0.3).get('rgb')], // darken
                        ],
                    };
                })
            },
            getExtensionsData() {
                let data = []
                let statusData = []
                let extensions = this.extensionWithCalls
                
                if (extensions.length) {
                    statusData = groupBy(extensions, 'representativeStatus')
                }
                
                for (let status in statusData) {
                    let statusType = statusTypes[status]
                    const statusText = this.$store.getters['entities/getStatusTextById'](status)
                    let sliceObject = {
                        color: statusType.color,
                        name: this.$t(statusText),
                        y: statusData[status].length,
                    }
                    
                    if (!data.length) {
                        sliceObject.sliced = true
                        sliceObject.selected = true
                    }
                    
                    data.push(sliceObject);
                }
                
                return data
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
                    this.chartOptions()
                }, this.data.DefaultRefreshInterval)
            }
            this.triggerResizeEvent()
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.chartOptions()
                },
            },
            extensionWithCalls: {
                deep: true,
                handler() {
                    if (isExternalDataWidget(this.data)) {
                        return
                    }
                    this.$nextTick(this.updateChartSeries)
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
    max-height: 390px;
}
</style>
