<template>
    <div>
        <div class="flex items-center mb-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-main-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 mt-4" v-if="chartVisibility">
            <highcharts :options="chartData"/>
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
        data() {
            return {
                chartVisibility: true,
                chartData: {},
            }
        },
        computed: {
            agentsOnline() {
                return this.$store.state.extensions.extensions.filter((e) => e.representativeStatus !== LOGOUT_STATUS)
            },
            agentsInACall() {
                return this.agentsOnline.filter(agent => agent.calls.length)
            },
        },
        methods: {
            async chartOptions() {
                if (isExternalDataWidget(this.data)) {
                    let data = await WidgetDataApi.getExternalData(this.data.EndPoint)
                    this.chartData = {...gaugeChartConfig, ...{series: data}}
                } else {
                    this.chartData = this.getAgentsData()
                }

                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            },
            getAgentsData() {
                let agentsOnline = this.agentsOnline

                let agentsInACall = this.agentsInACall ? this.agentsInACall.length : 0
                let showQueues = this.data.WidgetLayout.showQueues

                if (agentsInACall && showQueues) {
                    this.model.WidgetLayout.showQueues = this.queueWithActiveCalls.map((el) => el.QueueID)
                    let filteredQueues = agentsOnline.filter((el) => showQueues.includes(el.QueueID))
                    agentsInACall = filteredQueues.length
                }

                let range = {
                    min: 0,
                    max: agentsOnline.length
                }

                let stops = [
                    [0, '#55BF3B'],
                    [agentsOnline.length / 2 + 0.1, '#DDDF0D'],
                    [agentsOnline.length, '#DF5353']
                ]

                let yAxisConfig = {
                    ...gaugeChartConfig.yAxis,
                    ...this.data.yAxis,
                    ...range,
                    stops,
                }

                this.data.series = [{data: [agentsInACall]}]

                return {...gaugeChartConfig, ...this.data, ...{yAxis: yAxisConfig}}
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.chartOptions()
                }
            }
        },
    }
</script>
