<template>
    <div>
        <div class="flex items-center my-4 w-full">
            <div class="flex">
                <p class="text-2xl font-semibold">{{data.Title}}</p>
            </div>
            <div class="flex w-64" :class="{'mx-5': data.Title}">
                <range-filter
                    :date="widgetLayout.date.split(' - ')"
                    @on-change="onChangeDate">
                </range-filter>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 my-4">
            <highcharts :options="chartOptions"></highcharts>
        </div>
    </div>

</template>
<script>

    import {Chart} from 'highcharts-vue'
    import chartConfig from './chartConfig'
    import RangeFilter from "./RangeFilter";

    export default {
        name: 'TimeLineChart',
        components: {
            RangeFilter,
            highcharts: Chart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
            }
        },
        computed: {
            chartOptions() {
                return {
                    ...this.data.WidgetLayout
                }
            },
            widgetLayout() {
                return this.data.WidgetLayout || {date: ''}
            }
        },
        methods: {
            onChangeDate(date) {
                this.data.WidgetLayout.date = date
                this.$emit('update-item', this.data)
            }
        },
    }
</script>
<style scoped>
    .text-2xl {
        color: #2a2c36;
    }
</style>
