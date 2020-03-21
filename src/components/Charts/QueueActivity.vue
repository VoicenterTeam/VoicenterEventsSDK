<template>
    <div class="queue-activity__wrapper">
        <div class="flex flex-row md:items-center justify-between">
            <p v-if="data.Title" class="text-main-2xl font-semibold">
                {{data.Title}}
            </p>
        </div>
        <div class="bg-transparent rounded-lg pt-2" v-if="chartVisibility">
            <highcharts class="chart-content_wrapper" :options="chartData"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Chart} from 'highcharts-vue'
    import {activitiesToDisplay} from '@/enum/queueDashboardStatistics'
    import activityChartConfig from '@/components/Charts/Configs/ActivityGauge'

    export default {
        components: {
            highcharts: Chart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            queueStatistics: {
                type: Object,
                default: () => ({}),
            }
        },
        computed: {
            statisticCounts() {
                return this.queueStatistics;
            },
            activitiesToDisplay() {
                return get(this.data.WidgetLayout, 'ShowActivities')
            }
        },
        data() {
            return {
                chartData: {},
                chartVisibility: true,
            }
        },
        methods: {
            get,
            chartOptions() {
                let data = []
                let pane = {
                    startAngle: 0,
                    endAngle: 360,
                    background: []
                }

                try {
                    let activitiesToDisplay = this.activitiesToDisplay
                    let CallCount = get(this.statisticCounts, 'CallCount');
                    activitiesToDisplay.forEach((el) => {

                        let AnswerCount = 0
                        if (el === 'AnswerCount') {
                            let answerPercentage = 0
                            AnswerCount = get(this.statisticCounts['percentage'], '[1].value');
                            if (CallCount) {
                                answerPercentage = AnswerCount ? (AnswerCount / CallCount * 100).toFixed(2) : 0
                            }
                            let answerData = {
                                name: this.$t('Answer'),
                                data: [{
                                    color: '#5EB300',
                                    radius: '112%',
                                    innerRadius: '88%',
                                    y: Number(answerPercentage)
                                }]
                            }
                            let answerPane = {
                                outerRadius: '112%',
                                innerRadius: '88%',
                                backgroundColor: "rgba(72,187,120,0.3)",
                                borderWidth: 0
                            }
                            data.push(answerData)
                            pane['background'].push(answerPane)
                        }
                        if (el === 'InSLACount') {
                            let InSLACount = get(this.statisticCounts['primary'], 'InSLACount.value');

                            let inSLAPercentage = 0
                            if (AnswerCount) {
                                inSLAPercentage = InSLACount ? (InSLACount / AnswerCount * 100).toFixed(2) : 0
                            }

                            let InSLAData = {
                                name: this.$t('In SLA'),
                                data: [{
                                    color: '#61B5FF',
                                    radius: '87%',
                                    innerRadius: '63%',
                                    y: Number(inSLAPercentage)
                                }]
                            }
                            let InSLAPane = {
                                outerRadius: '87%',
                                innerRadius: '63%',
                                backgroundColor: "rgba(97,181,255,0.3)",
                                borderWidth: 0
                            }
                            data.push(InSLAData)
                            pane['background'].push(InSLAPane)
                        }
                    })
                    this.chartData = {
                        ...activityChartConfig,
                        ...{series: data},
                        ...{pane: pane},
                    }
                } catch (e) {
                    console.log(e)
                }
                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            }
        },
        watch: {
            statisticCounts: {
                immediate: true,
                handler: function () {
                    this.chartOptions()
                }
            }
        },
        mounted() {
            if (!this.data.WidgetLayout.ShowActivities) {
                this.$set(this.data.WidgetLayout, 'ShowActivities', activitiesToDisplay)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .queue-activity__wrapper {
        .chart-content_wrapper {
            max-height: 400px;
        }
    }
</style>
