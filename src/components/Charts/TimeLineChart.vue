<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)">
        <div class="flex items-center my-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-2xl font-semibold"
                   :class="$rtl.isRTL ? 'ml-5' : 'mr-5'">
                    {{data.Title}}
                </p>
                <range-filter
                        v-if="chartOptions.date"
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
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import RangeFilter from './RangeFilter'
    import chartConfig from './Configs/TimeLine'
    import {WidgetDataApi} from '../../api/widgetDataApi'
    import { getWidgetDataType } from "@/helpers/wigetUtils";
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
        computed:{
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
                let chartData = await WidgetDataApi.getData(this.endPoint)
                let chartType = ''
                let seriesData = [
                    {
                        "x": 1563441556000,
                        "y": 3
                    },
                    {
                        "x": 1564168362000,
                        "y": 2,
                        "color": "#d6dae1"
                    },
                    {
                        "x": 1564308352000,
                        "y": 1.6,
                        "color": "green"
                    }
                ]

                if (widgetDataType === widgetDataTypes.LINES_TYPE_ID) {
                    chartType = 'line'
                } else if (widgetDataType === widgetDataTypes.BARS_WITH_LINES_TYPE_ID) {
                    chartType = 'column'
                } else if (widgetDataType === widgetDataTypes.TIMELINE_TYPE_ID) {
                    seriesData = [{
                        name: 'Start prototype',
                        start: Date.UTC(2014, 10, 18),
                        end: Date.UTC(2014, 10, 25),
                        completed: 0.25
                    }, {
                        name: 'Test prototype',
                        start: Date.UTC(2014, 10, 27),
                        end: Date.UTC(2014, 10, 29)
                    }, {
                        name: 'Develop',
                        start: Date.UTC(2014, 10, 20),
                        end: Date.UTC(2014, 10, 25),
                        completed: {
                            amount: 0.12,
                            fill: '#fa0'
                        }
                    }, {
                        name: 'Run acceptance tests',
                        start: Date.UTC(2014, 10, 23),
                        end: Date.UTC(2014, 10, 26)
                    }]
                }
                let data = {
                    "Order": 6,
                    "chart": {
                        "type": chartType,
                        "marginTop": 45
                    },
                    "title": {
                        "text": this.data.Title
                    },
                    "xAxis": {
                        "type": "datetime",
                    },
                    "series": [
                        {
                            "pointWidth": 20,
                            "data": seriesData
                        }
                    ],
                    "tooltip": {
                        "formatter": function () {
                            return `<p style="font-size: 16px; color: ${this.point.color}; margin-top: 10px">${this.point.y}</p>`
                        },
                        "backgroundColor": "#ffffff",
                        "borderColor": "#ffffff",
                        "boxShadow": "0 10px 15px 0 rgba(143, 149, 163, 0.38)",
                        "borderRadius": 10,
                    },
                    "date": "05/29/2019 - 07/20/2019",
                }
                this.chartOptions = {...data, ...chartConfig.yAxisConfig}
                this.loading = false
                this.$emit('on-loading', false)
            }
        },
        mounted() {
            this.$emit('on-loading', true)
            this.getChartData()
        }
    }
</script>
<style scoped>
    .text-2xl {
        color: #2a2c36;
    }
</style>
