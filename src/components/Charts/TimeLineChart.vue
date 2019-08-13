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
                <edit-button @click="showUpdateDialog = true"
                             :class="{'border border-primary hover:bg-blue-200': editable}"/>
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
    import EditButton from '@/components/EditButton'
    import ChartUpdateDialog from './ChartUpdateDialog'

    export default {
        name: 'TimeLineChart',
        components: {
          EditButton,
            RangeFilter,
            ChartUpdateDialog,
            highcharts: Chart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            chartIndex: Number,
              editable: {
                type: Boolean,
                default: false
              }
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
