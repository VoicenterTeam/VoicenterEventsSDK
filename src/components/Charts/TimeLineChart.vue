<template>
    <div>
        <div class="flex items-center my-4 w-full">
            <div class="flex">
                <p class="text-2xl font-semibold">{{data.Title}}</p>
            </div>
            <div class="flex w-64 mx-5">
                <range-filter
                        :date="widgetLayout.date.split(' - ')"
                        @on-change="onChangeDate">
                </range-filter>
            </div>
            <div class="flex ml-auto">
                <button @click="showUpdateDialog = true"
                        class=" btn p-2 shadow rounded bg-white hover:bg-blue-100 active:shadow-inner">
                    <EditIcon class="w-5 h-5 text-primary"></EditIcon>
                </button>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 my-4">
            <highcharts :options="chartOptions"></highcharts>
            <chart-update-dialog
                    width="30%"
                    :chartTitle="data.Title"
                    @on-change="onChangeTitle"
                    :visible.sync="showUpdateDialog">
            </chart-update-dialog>
        </div>
    </div>

</template>
<script>

    import {Chart} from 'highcharts-vue'
    import chartConfig from './chartConfig'
    import RangeFilter from "./RangeFilter";
    import {EditIcon} from 'vue-feather-icons'
    import ChartUpdateDialog from './ChartUpdateDialog'

    export default {
        name: 'TimeLineChart',
        components: {
            EditIcon,
            RangeFilter,
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
                    ...this.data.WidgetLayout
                }
            },
            widgetLayout() {
                return this.data.WidgetLayout
            }
        },
        methods: {
            onChangeTitle(title) {
                this.data.Title = title
                this.updateChart(this.data)
            },
            onChangeDate(date) {
                this.data.WidgetLayout.date = date
                this.updateChart(this.data)
            },
            updateChart(data) {
                this.$emit('update-item', data)
            }
        },
    }
</script>
<style scoped>
    .text-2xl {
        color: #2a2c36;
    }
</style>
