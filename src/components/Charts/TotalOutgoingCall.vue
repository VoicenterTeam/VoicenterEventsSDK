<template>
    <div class="queue-activity__wrapper">
        <div class="flex flex-row md:items-center justify-between">
            <base-widget-title :title="data.Title"/>
        </div>
        <div class="bg-transparent rounded-lg pt-2" v-if="chartVisibility">
            <highcharts class="chart-content_wrapper" :options="chartData"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Chart} from 'highcharts-vue'
    import {convertHex} from "@/helpers/convertHex";
    import {getWidgetData} from "@/services/widgetService";
    import activityChartConfig from '@/components/Charts/Configs/ActivityGauge'

    export default {
        components: {
            highcharts: Chart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {},
        data() {
            return {
                chartData: {},
                chartVisibility: true,
                DEFAULT_STYLES: {
                    color: '#4ABB00',
                    fontSize: 20
                },
                fetchDataInterval: null
            }
        },
        methods: {
            get,
            async chartOptions() {
                let data = []
                let pane = {
                    startAngle: 0,
                    endAngle: 360,
                    background: []
                }

                try {
                    let Data = await getWidgetData(this.data)

                    let count = get(Data, "[0]['Total Outgoing Calls']")
                    let counterStyles = this.data.WidgetLayout['LayoutConfig']

                    let TotalCallData = {
                        name: this.$t('Total Outgoing Calls'),
                        data: [{
                            color: counterStyles['color'],
                            radius: '87%',
                            innerRadius: '63%',
                            y: count
                        }]
                    }
                    let rgb = convertHex(counterStyles['color'])
                    let TotalCallPane = {
                        outerRadius: '87%',
                        innerRadius: '63%',
                        backgroundColor: `rgba(${rgb},0.2)`,
                        borderWidth: 0
                    }
                    data.push(TotalCallData)
                    pane['background'].push(TotalCallPane)

                    let dataLabels = `<span style="font-size: ${counterStyles['fontSize'] + 'px'}; color: ${counterStyles['color']}">${this.$t('Total Calls')}: ${count}%</span>`
                    this.chartData = {
                        ...activityChartConfig,
                        series: data,
                        pane,
                        plotOptions: {
                            solidgauge: {
                                dataLabels: {
                                    enabled: true,
                                    format: dataLabels,
                                    y: -15,
                                    borderWidth: 0,
                                    useHTML: false,
                                    padding: 10,
                                },
                                linecap: 'round',
                                stickyTracking: false,
                                rounded: true
                            }
                        },
                    }
                } catch (e) {
                    console.log(e)
                }
                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            }
        },
        mounted() {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }
            if (!this.data.WidgetLayout['LayoutConfig']) {
                this.$set(this.data.WidgetLayout, 'LayoutConfig', this.DEFAULT_STYLES)
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.chartOptions()
                }
            }
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
<style lang="scss" scoped>
    .queue-activity__wrapper {
        .chart-content_wrapper {
            max-height: 400px;
        }
    }
</style>
