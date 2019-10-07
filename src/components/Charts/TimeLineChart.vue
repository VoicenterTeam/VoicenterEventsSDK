<template>
    <div>
        <div class="flex items-center my-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p class="text-2xl font-semibold"
                   :class="$rtl.isRTL ? 'ml-5' : 'mr-5'">
                    {{data.caption}}
                </p>
                <range-filter class="mt-2 md:mt-0"
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

    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import RangeFilter from './RangeFilter'
    import chartConfig from './Configs/TimeLine'

    export default {
        name: 'TimeLineChart',
        components: {
            RangeFilter,
            Highcharts,
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
        computed: {
            chartOptions() {
                return {...this.data.WidgetLayout, ...chartConfig.yAxisConfig}

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
        }
    }
</script>
<style scoped>
    .text-2xl {
        color: #2a2c36;
    }
</style>
