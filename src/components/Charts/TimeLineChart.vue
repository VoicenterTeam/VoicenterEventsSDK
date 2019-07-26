<template>
    <div class="bg-white p-5 rounded-lg py-4 my-4">
        <highcharts :options="chartOptions"></highcharts>
        <chart-update-dialog
                :chartTitle="data.title.text"
                @on-update="onUpdate"
                :visible.sync="showUpdateDialog">
        </chart-update-dialog>
    </div>
</template>
<script>

    import {Chart} from 'highcharts-vue'
    import chartConfig from './chartConfig'
    import ChartUpdateDialog from './ChartUpdateDialog'

    export default {
        name: 'TimeLineChart',
        components: {
            ChartUpdateDialog,
            highcharts: Chart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            chartIndex: Number
        },
        data() {
            return {
                showUpdateDialog: false
            }
        },
        computed: {
            chartOptions() {
                return {
                    ...this.data,
                    exporting: {
                        buttons: {
                            editButton: {
                                text: 'Edit',
                                y: -7,
                                onclick: () => {
                                    this.showUpdateDialog = !this.showUpdateDialog
                                }
                            },
                        }
                    },
                    rangeSelector: chartConfig.zoom
                }
            },
        },
        methods: {
            onUpdate(title) {
                let data = {...this.data, ...{title: {text: title}, index: this.chartIndex}}
                this.$store.dispatch('charts/updateChart', data);
            }
        },
    }
</script>
<style lang="scss">

</style>
