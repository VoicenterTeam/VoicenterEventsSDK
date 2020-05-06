<template>
    <div class="queue-activity__wrapper">
        <div class="flex flex-row md:items-center justify-between">
            <base-widget-title :title="data.Title"/>
        </div>
        <div class="bg-transparent rounded-lg pt-2" v-if="chartVisibility">
            <highcharts :options="chartData" class="chart-content_wrapper"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Chart} from 'highcharts-vue'
    import {convertHex} from '@/helpers/convertHex'
    import {queueActivities} from '@/enum/queueDashboardStatistics'
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
            statisticCounts () {
                return this.queueStatistics;
            },
            activitiesToDisplay () {
                return get(this.data.WidgetLayout, 'ShowActivities', [])
            }
        },
        data () {
            return {
                chartData: {},
                chartVisibility: true,
                DEFAULT_STYLES: {
                    AnswerCount: {
                        color: '#5EB300',
                        fontSize: 24
                    },
                    InSLACount: {
                        color: '#61B5FF',
                        fontSize: 24 // 24px
                    }
                },
            }
        },
        methods: {
            get,
            chartOptions () {
                let data = []

                let pane = {
                    startAngle: 0,
                    endAngle: 360,
                    background: []
                }

                try {
                    let activitiesToDisplay = this.activitiesToDisplay
                    let reversedCounts = false

                    const mainActivity = this.data.WidgetLayout.mainActivity

                    if (mainActivity !== 'AnswerCount') {
                        //Counts: AnswerCount, InSLACount
                        reversedCounts = true
                    }

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

                            if (activitiesToDisplay.length !== queueActivities.length) {
                                reversedCounts = false
                            }

                            let radius = reversedCounts ? '87%' : '112%'
                            let innerRadius = reversedCounts ? '63%' : '88%'

                            let answerData = {
                                name: this.$t('Answer'),
                                data: [{
                                    color: AnswerCountStyles['color'],
                                    radius: radius,
                                    innerRadius: innerRadius,
                                    y: Number(answerPercentage)
                                }]
                            }
                            let rgb = convertHex(AnswerCountStyles['color'])
                            let answerPane = {
                                outerRadius: radius,
                                innerRadius: innerRadius,
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

                            if (activitiesToDisplay.length !== queueActivities.length) {
                                reversedCounts = true
                            }

                            let radius = reversedCounts ? '112%' : '87%'
                            let innerRadius = reversedCounts ? '88%' : '63%'

                            let InSLAData = {
                                name: this.$t('In SLA'),
                                data: [{
                                    color: InSLACountStyles['color'],
                                    radius: radius,
                                    innerRadius: innerRadius,
                                    y: Number(inSLAPercentage)
                                }]
                            }

                            let rgb = convertHex(InSLACountStyles['color'])
                            let InSLAPane = {
                                outerRadius: radius,
                                innerRadius: innerRadius,
                                backgroundColor: `rgba(${rgb},0.3)`,
                                borderWidth: 0,
                            }
                            data.push(InSLAData)
                            pane['background'].push(InSLAPane)
                        }
                    })

                    let dataLabels = ['', ''];
                    let yMargin = 0

                    if (activitiesToDisplay.includes('AnswerCount')) {
                        let index = reversedCounts ? 1 : 0
                        dataLabels[index] = `<span style="font-size: ${AnswerCountStyles['fontSize'] + 'px'}; color: ${AnswerCountStyles['color']}">${answerPercentage}%<br>${this.$t('Answer')}</span>`
                        yMargin = AnswerCountStyles['fontSize']
                    }

                    if (activitiesToDisplay.includes('InSLACount')) {
                        let index = reversedCounts ? 0 : 1
                        dataLabels[index] = `<span style="font-size: ${InSLACountStyles['fontSize'] + 'px'}; color: ${InSLACountStyles['color']}">${inSLAPercentage}%<br>${this.$t('In SLA')}</span>`
                        yMargin += InSLACountStyles['fontSize']
                    }

                    dataLabels = `<p style="text-align: center;"> ${dataLabels[0]} <br> ${dataLabels[1]}<p>`
                    yMargin = (yMargin * 1.5 - activitiesToDisplay.length*5)

                    this.chartData = {
                        ...activityChartConfig,
                        series: data,
                        pane,
                        plotOptions: {
                            solidgauge: {
                                dataLabels: {
                                    enabled: true,
                                    format: dataLabels,
                                    y: -yMargin,
                                    borderWidth: 0,
                                    useHTML: true,
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
            },
            initWidgetConfig () {
                if (!this.data.WidgetLayout.ShowActivities) {
                    this.$set(this.data.WidgetLayout, 'ShowActivities', queueActivities)
                }
                if (!this.data.WidgetLayout['AnswerCount']) {
                    for (let key in this.DEFAULT_STYLES) {
                        this.$set(this.data.WidgetLayout, key, this.DEFAULT_STYLES[key])
                    }
                }
                if (!this.data.WidgetLayout['mainActivity']) {
                    this.$set(this.data.WidgetLayout, 'mainActivity', 'AnswerCount')
                }
            }
        },
        watch: {
            statisticCounts: {
                deep: true,
                immediate: true,
                handler: function () {
                    this.chartOptions()
                }
            }
        },
        mounted () {
            this.initWidgetConfig();
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
