<template>
    <div class="bg-white p-5 rounded-lg">
        <highcharts :constructor-type="'ganttChart'" :options="chartOptions"></highcharts>
        <chart-update-dialog
                :chartTitle="chartData.Title"
                @on-update="onUpdate"
                :visible.sync="showUpdateDialog">
        </chart-update-dialog>
    </div>
</template>
<script>
    import {Chart} from 'highcharts-vue'

    import Gantt from "highcharts/modules/gantt";
    import Highcharts from "highcharts";

    Gantt(Highcharts);
    import chartConfig from './chartConfig'
    import ChartUpdateDialog from './ChartUpdateDialog'

    export default {
        components: {
            ChartUpdateDialog,
            highcharts: Chart,
        },
        data() {
            return {
                showUpdateDialog: false
            }
        },
        props: {
            chartData: {
                type: Object,
                default: () => {
                }
            },
            chartIndex: Number
        },
        computed: {
            chartOptions() {
                return {
                    title: {
                        text: this.chartData.Title,
                    },
                    series: this.chartData.Series,
                    exporting: {
                        buttons: {
                            customButton: {
                                text: this.$t('common.edit'),
                                y: -7,
                                onclick: () => {
                                    this.showUpdateDialog = !this.showUpdateDialog
                                }
                            },
                        }
                    },
                }
            },
        },
        methods: {
            onUpdate(title) {
                let chartData = {...this.chartData, ...{Title: title, index: this.chartIndex}}
                this.$store.dispatch('charts/updateChart', chartData);
            }
        }
    }
</script>
<style lang="scss">

</style>
