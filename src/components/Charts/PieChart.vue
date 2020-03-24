<template>
    <div>
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
    import groupBy from 'lodash/groupBy'
    import { Tooltip } from 'element-ui'
    import { Chart } from 'highcharts-vue'
    import { TrashIcon } from 'vue-feather-icons'
    import statusTypes from '@/enum/statusTypes'
    import { LOGOUT_STATUS } from "@/enum/extensionStatuses";
    import { isExternalDataWidget } from '@/helpers/widgetUtils'
    import { WidgetDataApi } from "../../api/widgetDataApi";
    import Highcharts from 'highcharts'

    export default {
        components: {
            TrashIcon,
            highcharts: Chart,
            [Tooltip.name]: Tooltip,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                chartVisibility: true,
                chartData: {},
            }
        },
        computed: {
            extensions() {
                return this.$store.state.extensions.extensions
            },
            filteredExtensions() {
                let hideLoggedOutUsers = get(this.data.WidgetLayout, 'hideLoggedOutUsers')

                if (hideLoggedOutUsers) {
                    return this.extensions.filter(e => e.representativeStatus !== LOGOUT_STATUS)
                }
                return this.extensions
            },
        },
        methods: {
            async chartOptions() {

                let { series, colors } = await this.getChartSeriesData()

                this.chartData = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: this.$rtl.isRTL ? '{point.percentage:.1f}% : <b>{point.name}</b>' : '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: 'black',
                                    textOutline: 'none'
                                }
                            }
                        }
                    },
                    series,
                    colors,
                };

                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            },
            async getChartSeriesData() {
                let data = []
                const initialColors = []
                if (isExternalDataWidget(this.data)) {
                    data = await WidgetDataApi.getExternalData(this.data.EndPoint)
                } else {
                    data = this.getExtensionsData()
                }
                data.forEach((el) => {
                    initialColors.push(el.color)
                    delete el.color
                    return el
                });
                const series = [{
                    name: this.$t('Agents'),
                    colorByPoint: true,
                    data: data
                }]
                const colors = this.getColorOptions(initialColors)
                return {
                    data,
                    series,
                    colors
                }
            },
            async updateChartSeries() {
                const { colors, series } = await this.getChartSeriesData()
                this.$set(this.chartData, 'colors', colors)
                this.$set(this.chartData, 'series', series)
            },
            getColorOptions(colors) {
                return Highcharts.map(colors, function (color) {
                    return {
                        radialGradient: {
                            cx: 0.5,
                            cy: 0.3,
                            r: 0.7
                        },
                        stops: [
                            [0, color],
                            [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                        ]
                    };
                })
            },
            getExtensionsData() {
                let data = []
                let statusData = []
                let extensions = this.filteredExtensions

                if (extensions) {
                    statusData = groupBy(extensions, 'representativeStatus')
                }

                for (let status in statusData) {
                    let statusType = statusTypes[status]

                    let sliceObject = {
                        color: statusType.color,
                        name: this.$t(this.$store.getters['entities/getStatusTextById'](status)),
                        y: statusData[status].length,
                    }

                    if (!data.length) {
                        sliceObject.sliced = true
                        sliceObject.selected = true
                    }

                    data.push(sliceObject);
                }

                return data
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.chartOptions()
                }
            },
            filteredExtensions: {
                deep: true,
                handler() {
                    if (isExternalDataWidget(this.data)) {
                        return
                    }
                    this.$nextTick(this.updateChartSeries)
                }
            }
        },
    }
</script>
<style scoped lang="scss">
    .chart-content_wrapper {
        max-height: 390px;
    }
</style>
