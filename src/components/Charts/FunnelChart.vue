<template>
    <div class="rounded-lg pt-2">
        <div v-if="chartVisibility">
            <highcharts
                ref="xaxis-chart"
                class="chart-content_wrapper"
                :options="chartOptions"
                :callback="onInitChartCallback"
                :updateArgs="[true, true]"
            />
        </div>
        <div v-else class="flex flex-col w-full items-center">
            <h3 class="text-main-xl">{{ $t('general.noData') }}</h3>
            <icon-no-data class="w-64" />
        </div>
    </div>
</template>
<script>
    import Highcharts from 'highcharts'
    import { Chart } from 'highcharts-vue'
    import Funnel from 'highcharts/modules/funnel'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    import dialerMixin from '@/mixins/dialerMixin' 
    
    Funnel(Highcharts)
    
    export default {
        mixins: [actionMixin, dialerMixin],
        components: {
            Highcharts,
            highcharts: Chart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        data () {
            return {
                chartVisibility: false,
                chartOptions: {},
                chartInstance: false,
            }
        },
        computed: {
            getAllDialersToDisplay () {
                return this.getAllDialersWithTypeIVR
            }
        },
        methods: {
            onInitChartCallback(chart) {
                this.chartInstance = chart
            },
            tryPrintChart() {
                const divToPrint = this.$el.children[0]
                const newWin = window.open();
                newWin.document.write(divToPrint.innerHTML);
                newWin.document.close();
                newWin.focus();
                newWin.print();
            },
            tryDownloadChart(type) {
                this.$refs['xaxis-chart'].chart.exportChart({
                    type: type,
                })
            },
            async getWidgetData() {
                const campaigns = this.data.WidgetConfig.find(el => el.ParameterName === '{|campaign_ivr_list|}')
                    .WidgetParameterValueJson.EntityPositive
                let allDialersWithData = this.getAllDialersToDisplay
                    .filter(el => el.data && Object.keys(el.data).length && campaigns.includes(el.campaignID))

                if (!allDialersWithData || allDialersWithData.length === 0) {
                    this.chartVisibility = false
                    return
                }
                allDialersWithData = allDialersWithData
                    .map(el => {
                        return {
                            CallStatistics: el.data.CallStatistics
                        }
                    })
                    .reduce((previousValue, currentValue) => {
                        return {
                            TotalCalls: previousValue.CallStatistics.TotalCalls + currentValue.CallStatistics.TotalCalls,
                            TotalLeg1AnswerCalls: previousValue.CallStatistics.TotalLeg1AnswerCalls + currentValue.CallStatistics.TotalLeg1AnswerCalls,
                            TotalLeg1RingingCalls: previousValue.CallStatistics.TotalLeg1RingingCalls + currentValue.CallStatistics.TotalLeg1RingingCalls,
                            TotalLeg2AnswerCalls: previousValue.CallStatistics.TotalLeg2AnswerCalls + currentValue.CallStatistics.TotalLeg2AnswerCalls,
                            TotalLeg2RingingCalls: previousValue.CallStatistics.TotalLeg2RingingCalls + currentValue.CallStatistics.TotalLeg2RingingCalls,
                            TotalOriginatingCalls: previousValue.CallStatistics.TotalOriginatingCalls + currentValue.CallStatistics.TotalOriginatingCalls,
                            TotalPendingCalls: previousValue.CallStatistics.TotalPendingCalls + currentValue.CallStatistics.TotalPendingCalls
                        }
                    })

                const hasKeyCallStatistics = 'CallStatistics' in allDialersWithData
                if ((!hasKeyCallStatistics && Object.values(allDialersWithData).every(el => el === 0))
                    || (hasKeyCallStatistics && Object.values(allDialersWithData.CallStatistics).every(el => el === 0)))
                {
                    this.chartVisibility = false
                    return
                }

                this.chartVisibility = true
                const dataChart = hasKeyCallStatistics ? allDialersWithData.CallStatistics : allDialersWithData

                const data = {
                    series: [{
                        name: this.$t('dialer.totals'),
                        data: [
                            [this.$t('dialer.totalPendingCalls'), dataChart.TotalPendingCalls],
                            [this.$t('dialer.totalOriginatingCalls'), dataChart.TotalOriginatingCalls],
                            [this.$t('dialer.totalLeg1RingingCalls'), dataChart.TotalLeg1RingingCalls],
                            [this.$t('dialer.totalLeg1AnswerCalls'), dataChart.TotalLeg1AnswerCalls],
                            [this.$t('dialer.totalLeg2RingingCalls'), dataChart.TotalLeg2RingingCalls],
                            [this.$t('dialer.totalLeg2AnswerCalls'), dataChart.TotalLeg2AnswerCalls]
                        ]
                    }]
                }
                
                this.chartOptions = {
                    ...data,
                    chart: {
                        type: 'funnel'
                    },
                    title: {
                        text: this.$t('dialer.funnelChart')
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b> ({point.y:,.0f})',
                                softConnector: true
                            },
                            center: ['40%', '50%'],
                            neckWidth: '30%',
                            neckHeight: '25%',
                            width: '50%'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                plotOptions: {
                                    series: {
                                        dataLabels: {
                                            inside: true
                                        },
                                        center: ['50%', '50%'],
                                        width: '100%'
                                    }
                                }
                            }
                        }]
                    }
                }
            },
        },
        mounted() {
            this.getWidgetData()
        },
        watch: {
            getAllDialersToDisplay: {
                immediate: true,
                handler: function () {
                    this.getWidgetData()
                }
            },
            data: {
                immediate: true,
                handler: function () {
                    this.getWidgetData()
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .highcharts-credits {
    display: none;
}
</style>
