<template>
    <div>
        <div class="flex items-center mb-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 mt-4">
            <highcharts :options="chartData"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import groupBy from 'lodash/groupBy'
    import {Tooltip} from 'element-ui'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import {TrashIcon} from 'vue-feather-icons'
    import statusTypes from '@/enum/statusTypes'
    import {LOGOUT_STATUS} from "@/enum/extensionStatuses";
    import {isExternalDataWidget} from '@/helpers/widgetUtils'
    import {WidgetDataApi} from "../../api/widgetDataApi";

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
                chartData: {}
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
            async chartOptions() {
                let data = []

                if (isExternalDataWidget) {
                    data = await WidgetDataApi.getExternalData(this.data.EndPoint)
                } else {
                    data = this.getExtensionsData()
                }

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
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        name: this.$t('Agents'),
                        colorByPoint: true,
                        data: data
                    }]
                };
            },
        },
        methods: {
            getExtensionsData() {
                let statusData = []
                let extensions = this.filteredExtensions

                if (extensions) {
                    statusData = groupBy(extensions, 'representativeStatus')
                }

                for (let status in statusData) {
                    let statusType = statusTypes[status]

                    let sliceObject = {
                        color: statusType.color,
                        name: this.$t(statusType.text),
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
        }
    }
</script>
