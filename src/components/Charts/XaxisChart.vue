<template>
    <div class="rounded-lg pt-2"
         v-if="chartVisibility">
        <highcharts
            ref="xaxis-chart"
            class="chart-content_wrapper"
            :options="chartOptions"
            :callback="onInitChartCallback"
            :updateArgs="[true, true]"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Highcharts from 'highcharts'
    import { Chart } from 'highcharts-vue'
    import Xrange from 'highcharts/modules/xrange'
    import { getDefaultTimeDelay } from '@/enum/generic'
    import { getWidgetData } from '@/services/widgetService'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    
    Xrange(Highcharts)
    
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
                this.$refs['xaxis-chart'].chart.exportChart({
                    type: type,
                })
            },
            async getWidgetData() {
                try {
                    let Data = await getWidgetData(this.data)
                    let chartData = get(Data, '0')
                    
                    let series = chartData['series']
                    series.forEach((serie) => {
                        serie['pointWidth'] = 10
                        serie['data'].map((el) => el['x2'] = el['end'])
                    })
                    
                    chartData['series'] = series
                    
                    this.chartOptions = chartData
                    
                    this.chartOptions = {
                        ...this.chartOptions,
                        chart: {
                            type: 'xrange',
                        },
                        yAxis: {
                            ...this.chartOptions['yAxis'],
                            ...{
                                title: {
                                    text: '',
                                },
                                reversed: true,
                            },
                        },
                        plotOptions: {
                            series: {
                                pointPadding: 0.25,
                            },
                        },
                    }
                    
                    this.chartVisibility = false
                    this.$nextTick(() => {
                        this.chartVisibility = true
                    })
                } catch (e) {
                    console.warn(e)
                    let status = get(e, 'response.status')
                    if (status === 400) {
                        let refreshDelay = getDefaultTimeDelay()
                        this.$set(this.data, 'DefaultRefreshInterval', refreshDelay)
                    }
                }
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
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.getWidgetDataWithRefreshInterval()
                }
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
