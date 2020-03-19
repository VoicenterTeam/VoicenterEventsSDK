<template>
    <div>
        <div class="flex flex-row md:items-center justify-between">
            <p v-if="data.Title" class="text-main-2xl font-semibold">
                {{data.Title}}
            </p>
        </div>
        <div class="rounded-lg pt-2" v-if="data.WidgetID && chartVisibility">
            <highcharts class="chart-content_wrapper" :contstructor-chart="chartConstructorType"
                        :options="chartOptions"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import chartConfig from './Configs/TimeLine'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import {getWidgetData} from '@/services/widgetService'
    import {getDefaultTimeDelay} from "@/enum/generic";

    export default {
        name: 'TimeLineChart',
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
        data() {
            return {
                chartVisibility: true,
                chartOptions: {},
                fetchDataInterval: null
            }
        },
        computed: {
            chartConstructorType() {
                let widgetDataType = this.data.DataTypeID
                if (widgetDataType === widgetDataTypes.TIMELINE_TYPE_ID) {
                    return 'ganttChart'
                }
                return 'chart'
            },
        },
        methods: {
            async getWidgetData() {
                try {
                    let widgetDataType = this.data.DataTypeID
                    let Data = await getWidgetData(this.data)
                    if (!Data) {
                        return
                    }
                    let chartData = get(Data, '0', {series: []})
                    if (widgetDataType === widgetDataTypes.EXTERNAL_DATA_TYPE_ID) {
                        chartData = {series: Data}
                    } else {
                        chartData = get(Data, '0', {series: []})
                    }
                    let chartType = ''
                    if (widgetDataType === widgetDataTypes.LINES_TYPE_ID) {
                        chartType = 'line'
                    } else if (widgetDataType === widgetDataTypes.BARS_WITH_LINES_TYPE_ID) {
                        chartType = 'column'
                    } else if (widgetDataType === widgetDataType.CHART_QUEUE) {
                        chartData = {
                            ...chartData,
                            ...chartConfig.yAxisConfig
                        }
                    }

                    let data = {
                        "Order": 6,
                        "chart": {
                            "type": chartType,
                            "marginTop": 45
                        },
                        "tooltip": {
                            "formatter": function () {
                                return `<p style="font-size: 16px; color: ${this.point.color}; margin-top: 10px">${this.point.y}</p>`
                            },
                            "backgroundColor": "#ffffff",
                            "borderColor": "#ffffff",
                            "boxShadow": "0 10px 15px 0 rgba(143, 149, 163, 0.38)",
                            "borderRadius": 10,
                        },
                        ...chartData,
                    }

                    this.chartVisibility = false
                    this.$nextTick(() => {
                        this.chartVisibility = true
                    })

                    this.chartOptions = data
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
<style scoped lang="scss">
    .chart-content_wrapper {
        max-height: 400px;
    }
</style>
