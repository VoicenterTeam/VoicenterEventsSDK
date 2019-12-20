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
            <highcharts :options="chartOptions"/>
        </div>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import {TrashIcon} from 'vue-feather-icons'
    import gaugeChartConfig from './Configs/Gauge'
    import {WidgetDataApi} from '@/api/widgetDataApi'
    import {LOGOUT_STATUS} from '@/enum/extensionStatuses'
    import highchartsMoreInit from 'highcharts/highcharts-more'
    import solidGaugeInit from 'highcharts/modules/solid-gauge'
    import {isExternalDataWidget} from '@/helpers/widgetUtils'

    highchartsMoreInit(Highcharts)
    solidGaugeInit(Highcharts)

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
        computed: {
            agentsOnline() {
                return this.$store.state.extensions.extensions.filter((e) => e.representativeStatus !== LOGOUT_STATUS)
            },
            agentsInACall() {
                return this.agentsOnline.filter(agent => agent.calls.length)
            },
            async chartOptions() {
                if (isExternalDataWidget) {
                    let data = await WidgetDataApi.getExternalData(this.data.EndPoint)
                    return {...gaugeChartConfig, ...data}
                } else {
                    return this.getAgentsData()
                }
            },
        },
        methods: {
            getAgentsData() {
                let agentsOnline = this.agentsOnline

                let range = {
                    min: 0,
                    max: agentsOnline.length
                }

                let yAxisConfig = {
                    ...gaugeChartConfig.yAxis,
                    ...this.data.yAxis,
                    ...range,
                    stops,
                }

                let stops = [
                    [0, '#55BF3B'],
                    [agentsOnline.length / 2 + 0.1, '#DDDF0D'],
                    [agentsOnline.length, '#DF5353']
                ]

                data.series = [{data: [this.agentsInACall ? this.agentsInACall.length : 0]}]

                return {...gaugeChartConfig, ...this.data, ...{yAxis: yAxisConfig}}
            }
        }
    }
</script>
