<template>
    <div class="gouge-wrapper">
        <div class="flex flex-row md:items-center justify-between">
            <p v-if="data.Title" class="text-main-2xl font-semibold">
                {{data.Title}}
            </p>
        </div>
        <div class="bg-transparent pt-2 rounded-lg" v-if="chartVisibility">
            <highcharts :options="chartData"/>
        </div>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import {TrashIcon} from 'vue-feather-icons'
    import queueMixin from '@/mixins/queueMixin'
    import gaugeChartConfig from './Configs/Gauge'
    import {WidgetDataApi} from '@/api/widgetDataApi'
    import highchartsMoreInit from 'highcharts/highcharts-more'
    import solidGaugeInit from 'highcharts/modules/solid-gauge'
    import {isExternalDataWidget} from '@/helpers/widgetUtils'

    highchartsMoreInit(Highcharts)
    solidGaugeInit(Highcharts)

    export default {
        mixins: [queueMixin],
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

                let queuesCount = this.allQueues.length

                let range = {
                    min: 0,
                    max: queuesCount
                }

                let stops = [
                    [0, '#55BF3B'],
                    [queuesCount / 2 + 0.1, '#DDDF0D'],
                    [queuesCount, '#DF5353']
                ]

                let yAxisConfig = {
                    ...gaugeChartConfig.yAxis,
                    ...this.data.yAxis,
                    ...range,
                    stops,
                }

                let agentsInACall = this.filteredQueuesWithActiveCalls.length
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
            },
            allQueues() {
                this.chartOptions()
            }
        },
        mounted() {
            if (!this.data.WidgetLayout.showQueues) {
                this.$set(this.data.WidgetLayout, 'showQueues', this.allQueues.map((el) => el.QueueID))
            }
        },
    }
</script>
<style>
    .gouge-wrapper {
        max-height: 300px;
    }
</style>
