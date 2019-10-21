<template>
    <div>
        <div class="flex items-center my-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.caption" class="text-2xl font-semibold"
                   :class="$rtl.isRTL ? 'ml-5' : 'mr-5'">
                    {{data.caption}}
                </p>
                <range-filter class="mt-2 md:mt-0"
                              :date="widgetLayout.date.split(' - ')"
                              @on-change="onChangeDate">
                </range-filter>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 my-4">
            <highcharts :options="chartOptions"></highcharts>
        </div>
    </div>
</template>
<script>

    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import RangeFilter from './RangeFilter'
    import chartConfig from './Configs/TimeLine'

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
            }
        },
        computed: {
            chartOptions() {
                return  {
                        "Order": 8,
                        "title": {
                            "text": ""
                        },
                        "xAxis": {
                            "type": "datetime",
                            "lineColor": ""
                        },
                        "series": [
                            {
                                "name": "Outgoing",
                                "color": "#2675ff",
                                "type": "spline",
                                "data": [
                                    {
                                        "x": 1563441556000,
                                        "y": 1
                                    },
                                    {
                                        "x": 1564168362000,
                                        "y": 2,
                                    },
                                    {
                                        "x": 1564308352000,
                                        "y": 3,
                                    }
                                ],
                                "shadow": {
                                    "offsetY": 15,
                                    "opacity": 0.004,
                                    "width": 20
                                }
                            }, {
                                "name": "Incoming",
                                "color": "#876cff",
                                "type": "spline",
                                "dashStyle": "shortdot",
                                "data": [
                                    {
                                        "x": 1563441556000,
                                        "y": 2.25
                                    },
                                    {
                                        "x": 1564168362000,
                                        "y": 1.5,
                                    },
                                    {
                                        "x": 1564308352000,
                                        "y": 4,
                                    }
                                ]
                            }
                        ],
                        "legend": {
                            "enabled": true,
                            "align": "center",
                            "verticalAlign": "top",
                            "floating": true,
                            "y": -15,
                            "itemStyle": {
                                "color": "#899398",
                                "fontFamily": "Montserrat",
                                "fontWeight": 500,
                                "fontSize": "15px"
                            },
                        },
                        "yAxis": [{
                            "opposite": false,
                            "title": false,
                            "labels": {
                                "style": {
                                    "color": "#bfc5d0",
                                    "fontSize": "16px"
                                }
                            },
                        }],
                        "tooltip": {
                            "formatter": function () {
                                return `<p style="font-size: 16px; color: ${this.point.color}; margin-top: 10px">${this.point.y}</p>`
                            },
                            "backgroundColor": "#ffffff",
                            "borderColor": "#ffffff",
                            "boxShadow": "0 10px 15px 0 rgba(143, 149, 163, 0.38)",
                            "borderRadius": 10,
                        },
                        "date": "06/29/2019 - 07/29/2019"
                }
                return {...this.data.WidgetLayout, ...chartConfig.yAxisConfig}
            },
            widgetLayout() {
                return this.data.WidgetLayout || {date: ''}
            }
        },
        methods: {
            onChangeDate(date) {
                this.data.WidgetLayout.date = date
                this.$emit('update-item', this.data)
            }
        }
    }
</script>
<style scoped>
    .text-2xl {
        color: #2a2c36;
    }
</style>
