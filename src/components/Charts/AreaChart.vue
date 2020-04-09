<template>
    <div>
        <div class="flex flex-row md:items-center justify-between">
            <p v-if="data.Title" class="text-main-2xl font-semibold">
                {{data.Title}}
            </p>
        </div>
        <div class="rounded-lg pt-2" v-if="data.WidgetID && chartVisibility && chartOptions.series">
            <highcharts class="chart-content_wrapper"
                        :options="chartOptions"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Chart} from 'highcharts-vue'
    import Highcharts from "highcharts";
    import {getWidgetData} from "@/services/widgetService";
    import {getDefaultTimeDelay} from "@/enum/generic";
    import Area from "highcharts/modules/accessibility";

    Area(Highcharts);

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
        data() {
            return {
                chartVisibility: true,
                fetchDataInterval: null,
                chartOptions: {},
            }
        },
        methods: {
            async getWidgetData() {
                try {

                    this.chartOptions = {
                        chart: {
                            type: 'area'
                        },
                        xAxis: {
                            allowDecimals: false,
                            labels: {
                                formatter: function () {
                                    return this.value; // clean, unformatted number for year
                                }
                            },
                            accessibility: {
                                rangeDescription: 'Range: 1940 to 2017.'
                            }
                        },
                        plotOptions: {
                            area: {
                                pointStart: 1940,
                                marker: {
                                    enabled: false,
                                    symbol: 'circle',
                                    radius: 2,
                                    states: {
                                        hover: {
                                            enabled: true
                                        }
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'USA',
                            data: [
                                null, null, null, null, null, 6, 11, 32, 110, 235,
                                369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
                                20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
                                26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                                24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
                                21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
                                10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
                                5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
                            ]
                        }, {
                            name: 'USSR/Russia',
                            data: [null, null, null, null, null, null, null, null, null, null,
                                5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
                                1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
                                11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
                                30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
                                37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                                21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
                                12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
                            ]
                        }]
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
