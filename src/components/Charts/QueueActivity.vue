<template>
    <div class="queue-activity__wrapper">
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
    import {Chart} from 'highcharts-vue'
    import {queueActivities} from '@/enum/queueDashboardStatistics'
    import activityChartConfig from '@/components/Charts/Configs/ActivityGauge'
    import {convertHex} from "@/helpers/convertHex";

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
                DEFAULT_STYLES: {
                    AnswerCount: {
                        color: '#5EB300',
                        fontSize: 32
                    },
                    InSLACount: {
                        color: '#61B5FF',
                        fontSize: 32 // 32px
                    }
                },
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
                    let answerPercentage = 0
                    let inSLAPercentage = 0

                    let AnswerCountStyles = this.data.WidgetLayout['AnswerCount']
                    let InSLACountStyles = this.data.WidgetLayout['InSLACount']

                    activitiesToDisplay.forEach((el) => {
                        if (el === 'AnswerCount') {
                            let AnswerCount = get(this.statisticCounts['percentage'], '[1].value');
                            if (CallCount) {
                                answerPercentage = AnswerCount ? (AnswerCount / CallCount * 100).toFixed(2) : 0
                            }
                            let answerData = {
                                name: this.$t('Answer'),
                                data: [{
                                    color: AnswerCountStyles['color'],
                                    radius: '112%',
                                    innerRadius: '88%',
                                    y: Number(answerPercentage)
                                }]
                            }
                            let rgb = convertHex(AnswerCountStyles['color'])
                            let answerPane = {
                                outerRadius: '112%',
                                innerRadius: '88%',
                                backgroundColor: `rgba(${rgb},0.3)`,
                                borderWidth: 0
                            }
                            data.push(answerData)
                            pane['background'].push(answerPane)
                        }
                        if (el === 'InSLACount') {
                            let InSLACount = get(this.statisticCounts['primary'], 'InSLACount.value');

                            if (CallCount) {
                                inSLAPercentage = InSLACount ? (InSLACount / CallCount * 100).toFixed(2) : 0
                            }
                            let InSLAData = {
                                name: this.$t('In SLA'),
                                data: [{
                                    color: InSLACountStyles['color'],
                                    radius: '87%',
                                    innerRadius: '63%',
                                    y: Number(inSLAPercentage)
                                }]
                            }
                            let rgb = convertHex(InSLACountStyles['color'])
                            let InSLAPane = {
                                outerRadius: '87%',
                                innerRadius: '63%',
                                backgroundColor: `rgba(${rgb},0.3)`,
                                borderWidth: 0,
                            }
                            data.push(InSLAData)
                            pane['background'].push(InSLAPane)
                        }
                    })
                    let dataLabels = `<span style="font-size: ${AnswerCountStyles['fontSize']+'px'}; color: ${AnswerCountStyles['color']}">${this.$t('Answer')}: ${answerPercentage}%</span><br><span style="font-size: ${InSLACountStyles['fontSize']+'px'}; color: ${InSLACountStyles['color']}">${this.$t('In SLA')}: ${inSLAPercentage}%</span>`
                    this.chartData = {
                        ...activityChartConfig,
                        series: data,
                        pane,
                        plotOptions: {
                            solidgauge: {
                                dataLabels: {
                                    enabled: true,
                                    format: dataLabels,
                                    y: -40,
                                    borderWidth: 0,
                                    useHTML: true,
                                    backgroundColor: 'rgba(255, 255,255, 0.5)',
                                    zIndex: 100
                                },
                                linecap: 'round',
                                stickyTracking: false,
                                rounded: true
                            }
                        },
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
                this.$set(this.data.WidgetLayout, 'ShowActivities', queueActivities)
            }
            if (!this.data.WidgetLayout['AnswerCount']) {
                for (let key in this.DEFAULT_STYLES) {
                    this.$set(this.data.WidgetLayout, key, this.DEFAULT_STYLES[key])
                }
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
