<template>
    <div class="bg-white p-5 rounded-lg py-4 my-4">
        <range-filter
                :date="data.date? data.date.split(' - '): ''"
                @on-change="onChangeDate">
        </range-filter>
        <highcharts :options="chartOptions"></highcharts>
        <chart-update-dialog
                :chartTitle="data.title.text"
                @on-change="onChangeTitle"
                :visible.sync="showUpdateDialog">
        </chart-update-dialog>

    </div>
</template>
<script>

    import {Chart} from 'highcharts-vue'
    import chartConfig from './chartConfig'
    import ChartUpdateDialog from './ChartUpdateDialog'
    import RangeFilter from "./RangeFilter";

    export default {
        name: 'TimeLineChart',
        components: {
            highcharts: Chart,
            ChartUpdateDialog,
            RangeFilter
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
                            button: {
                                text: this.$t('common.edit'),
                                y: -7,
                                onclick: () => {
                                    this.showUpdateDialog = !this.showUpdateDialog
                                }
                            },
                        },
                    },
                }
            },
        },
        methods: {
            onChangeTitle(title) {
                this.data.title = {text: title}
                this.updateChart()
            },
            onChangeDate(date) {
                this.data.date = date
                this.updateChart()
            },
            updateChart() {
                this.$emit('update-item', this.data)
            }
        },
    }
</script>
<style lang="scss">

</style>
