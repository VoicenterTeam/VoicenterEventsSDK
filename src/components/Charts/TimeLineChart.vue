<template>
    <div>
        <div class="flex items-center my-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p class="text-2xl font-semibold"
                   :class="$rtl.isRTL ? 'ml-5' : 'mr-5'">
                    {{data.WidgetLayout.caption}}
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

    import {Chart} from 'highcharts-vue'
    import chartConfig from './chartConfig'
    import RangeFilter from './RangeFilter'
    import noDataModule from 'highcharts/modules/no-data-to-display'
    import Exporting from 'highcharts/modules/exporting'

    import Highcharts from 'highcharts'

    export default {
        name: 'TimeLineChart',
        components: {
            RangeFilter,
            highcharts: Chart,
            Highcharts
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
            return {}
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
        beforeMount() {
            Highcharts.setOptions(chartConfig)
            Exporting(Highcharts)
            noDataModule(Highcharts)
        }
    }
</script>
<style scoped>
    .text-2xl {
        color: #2a2c36;
    }
</style>
