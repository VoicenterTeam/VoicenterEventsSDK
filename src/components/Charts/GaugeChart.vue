<template>
    <highcharts :options="chartOptions"></highcharts>
</template>
<script>

    import {Chart} from 'highcharts-vue'
    import Highcharts from 'highcharts'
    import gaugeChartConfig from './gaugeChartConfig'
    import highchartsMoreInit from 'highcharts/highcharts-more'
    import solidGaugeInit from 'highcharts/modules/solid-gauge'

    highchartsMoreInit(Highcharts)
    solidGaugeInit(Highcharts)

    export default {
        components: {
            highcharts: Chart
        },
        props: {
            chartData: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            chartOptions() {
                let yAxisConfig = {...gaugeChartConfig.yAxis, ...this.chartData.yAxis}
                return {...gaugeChartConfig, ...this.chartData, ...{yAxis: yAxisConfig}}
            }
        }
    }
</script>

<style lang="scss">
</style>
