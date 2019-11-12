<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)">
        <div class="flex items-center my-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-2xl font-semibold"
                   :class="$rtl.isRTL ? 'ml-5' : 'mr-5'">
                    {{data.Title}}
                </p>
                <!-- TODO adapt based on api data. Check exactly how to change the chart interval via api-->
                <range-filter
                    v-if="chartOptions.date && typeof chartOptions.date === 'string'"
                    :date="chartOptions.date.split(' - ')"
                    @on-change="onChangeDate">
                </range-filter>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 my-4" v-if="data.WidgetID">
            <highcharts :contstructor-chart="chartConstructorType" :options="chartOptions"></highcharts>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import RangeFilter from './RangeFilter'
    import chartConfig from './Configs/TimeLine'
    import {WidgetDataApi} from '../../api/widgetDataApi'
    import {getWidgetDataType} from "@/helpers/wigetUtils";
    import widgetDataTypes from "@/enum/widgetDataTypes";

    export default {
        name: 'TimeLineChart',
        components: {
            RangeFilter,
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
            endPoint: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                chartOptions: {},
                loading: true,
            }
        },
        computed: {
            chartConstructorType() {
                let widgetDataType = getWidgetDataType(this.data)
                if (widgetDataType === widgetDataTypes.TIMELINE_TYPE_ID) {
                    return 'ganttChart'
                }
                return 'chart'
            }
        },
        methods: {
            onChangeDate(date) {
                this.data.WidgetLayout.date = date
                this.$emit('update-item', this.data)
            },
            async getChartData() {
                let widgetDataType = getWidgetDataType(this.data)
                let Data = await WidgetDataApi.getData(this.endPoint)
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
                this.chartOptions = data
                this.loading = false
                this.$emit('on-loading', false)
            }
        },
        mounted() {
            this.$emit('on-loading', true)

        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.getChartData()
                }
            },
        }
    }
</script>
<style scoped>
    .text-2xl {
        color: #2a2c36;
    }
</style>
