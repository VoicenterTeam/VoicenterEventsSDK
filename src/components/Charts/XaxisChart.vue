<template>
    <div class="rounded-lg pt-2" v-if="chartVisibility">
        <highcharts :options="chartOptions"
                    class="chart-content_wrapper"/>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Chart} from 'highcharts-vue'
    import Highcharts from "highcharts";
    import {getWidgetData} from "@/services/widgetService";
    import {getDefaultTimeDelay} from "@/enum/generic";
    import Xrange from "highcharts/modules/xrange";

    Xrange(Highcharts);

    export default {
        components: {
            Highcharts,
            highcharts: Chart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                chartVisibility: true,
                fetchDataInterval: null,
                chartOptions: {},
            }
        },
        methods: {
            async getWidgetData () {
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

                    this.chartOptions['chart'] = {
                        type: 'xrange'
                    }
                    this.chartOptions['yAxis'] = {
                        ...this.chartOptions['yAxis'],
                        ...{
                            title: {
                                text: ''
                            },
                            reversed: true
                        }
                    }
                    this.chartOptions['plotOptions'] = {
                        series: {
                            pointPadding: 0.25
                        }
                    },
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
            }
        },
        mounted () {
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
                }
            }
        },
        beforeDestroy () {
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
