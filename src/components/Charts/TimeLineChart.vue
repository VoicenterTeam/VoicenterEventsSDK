<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)">
        <div class="flex items-center mb-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 mt-4" v-if="data.WidgetID">
            <highcharts :contstructor-chart="chartConstructorType" :options="chartOptions"/>
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
                chartOptions: {},
                loading: true,
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
            refreshInterval() {
                return get(this.data.WidgetLayout, 'refreshInterval')
            }
        },
        methods: {
            async getChartData() {
                let widgetDataType = this.data.DataTypeID
                let Data = await getWidgetData(this.data)
                let chartData = get(Data, '0', {series: []})
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

                if (widgetDataType === widgetDataTypes.EXTERNAL_DATA_TYPE_ID) {
                    this.chartOptions = Data
                } else {
                    this.chartOptions = data
                }
                this.loading = false
                this.$emit('on-loading', false)
            }
        },
        mounted() {
            this.$emit('on-loading', true)
            this.getChartData()
            if (this.refreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getChartData()
                }, this.refreshInterval)
            }
        },
        watch: {
            data() {
                this.getChartData()
            },
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
