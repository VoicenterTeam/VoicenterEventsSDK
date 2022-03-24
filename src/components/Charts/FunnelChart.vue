<template>
    <div class="rounded-lg pt-2"
         v-if="chartVisibility">
        <highcharts
            ref="xaxis-chart"
            class="chart-content_wrapper"
            :options="chartOptions"
            :callback="onInitChartCallback"
            :updateArgs="[true, true]"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
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
            editable: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                chartVisibility: true,
                fetchDataInterval: null,
                chartOptions: {},
                chartInstance: false,
            }
        },
        // computed: {
        //     campaigns() {
        //         return this.$store.state.dialers
        //     }
        // },
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
                const allDialersWithData = this.getAllDialersWithTypeIVR
                    .filter(el => el.data && Object.keys(el.data).length)
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

                    const data = {
                        series: [{
                            name: 'Totals',
                            data: [
                                ['TotalPendingCalls', allDialersWithData.TotalPendingCalls],
                                ['TotalOriginatingCalls', allDialersWithData.TotalOriginatingCalls],
                                ['TotalLeg1RingingCalls', allDialersWithData.TotalLeg1RingingCalls],
                                ['TotalLeg1AnswerCalls', allDialersWithData.TotalLeg1AnswerCalls],
                                ['TotalLeg2RingingCalls', allDialersWithData.TotalLeg2RingingCalls],
                                ['TotalLeg2AnswerCalls', allDialersWithData.TotalLeg2AnswerCalls]
                            ]
                        }]
                    }
                    
                    this.chartOptions = {
                        ...data,
                        chart: {
                            type: 'funnel'
                        },
                        title: {
                            text: 'IVR Funnel Chart'
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
                    
                //     this.chartVisibility = false
                //     this.$nextTick(() => {
                //         this.chartVisibility = true
                //     })
                // } catch (e) {
                //     console.warn(e)
                //     let status = get(e, 'response.status')
                //     if (status === 400) {
                //         let refreshDelay = getDefaultTimeDelay()
                //         this.$set(this.data, 'DefaultRefreshInterval', refreshDelay)
                //     }
                // }
            },
        },
        mounted() {
            this.getWidgetData()
        //     if (this.data.DefaultRefreshInterval) {
        //         this.fetchDataInterval = setInterval(() => {
        //             this.getWidgetData()
        //         }, this.data.DefaultRefreshInterval)
        //     }
        },
        // watch: {
        //     data: {
        //         immediate: true,
        //         handler: function () {
        //             this.getWidgetData()
        //         },
        //     },
        // },
        // beforeDestroy() {
        //     if (this.fetchDataInterval) {
        //         clearInterval(this.fetchDataInterval)
        //     }
        // },
    }
</script>
<style lang="scss" scoped>
.chart-content_wrapper {
    max-height: 400px;
}
</style>
