<template>
    <div class="bg-transparent pt-4 rounded-lg"
         v-if="chartVisibility">
        <highcharts
            ref="gauge-chart"
            class="chart-content_wrapper"
            :options="chartData"
            :callback="onInitChartCallback"
            :updateArgs="[true, true]"
        />
        <div class="mb-4">
            <data-table
                :border="tableBorder"
                :columns="availableColumns"
                :editable="editable"
                can-sort-rows="custom"
                :showColumns="visibleColumns"
                :tableData="fetchTableData">
                <template v-slot:WaitingTime="{row}">
                    <waiting-time :call="row.Call" :key="row.Call.ivrid" :textColor="'text-white'"
                                  v-if="row.Call"/>
                </template>
            </data-table>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Highcharts from 'highcharts'
    import { Tooltip } from 'element-ui'
    import { Chart } from 'highcharts-vue'
    import bus from '@/event-bus/EventBus'
    import queueMixin from '@/mixins/queueMixin'
    import { TrashIcon } from 'vue-feather-icons'
    import gaugeChartConfig from './Configs/Gauge'
    import { WidgetDataApi } from '@/api/widgetDataApi'
    import highchartsMoreInit from 'highcharts/highcharts-more'
    import solidGaugeInit from 'highcharts/modules/solid-gauge'
    import { isExternalDataWidget } from '@/helpers/widgetUtils'
    import actionMixin from '@/components/Charts/Configs/actionMixin'
    import {activeGaugeCallColumns} from "@/enum/queueConfigs";
    import orderBy from "lodash/orderBy";
    
    highchartsMoreInit(Highcharts)
    solidGaugeInit(Highcharts)
    
    export default {
        mixins: [queueMixin, actionMixin],
        components: {
            TrashIcon,
            highcharts: Chart,
            [Tooltip.name]: Tooltip,
            DataTable: () => import('@/components/Table/DataTable'),
            WaitingTime: () => import('@/components/Widgets/Data/Queue/WaitingTime')
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                chartVisibility: true,
                chartData: {},
                chartInstance: false,
                fetchDataInterval: null,
                tableBorder: true,
                activeGaugeCallColumns,
            }
        },
        computed: {
            getMaximumRange() {
                return get(this.data, 'WidgetLayout.maximumRange', 0)
            },
            getLabelFontSize() {
                return get(this.data, 'WidgetLayout.labelFontSize', 16)
            },
            availableColumns () {
                return get(this.data.WidgetLayout, 'Columns.availableColumns') || activeGaugeCallColumns
            },
            visibleColumns () {
                return get(this.data.WidgetLayout, 'Columns.visibleColumns') || activeGaugeCallColumns.map(c => c.prop)
            },
            fetchTableData: {
                get: function () {
                    let data = []
                    let rowsCounter = 0
                    this.filteredQueuesWithActiveCalls.forEach((queue) => {
                        queue.Calls.forEach((call) => {
                            rowsCounter++
                            data.push({
                                Id: rowsCounter,
                                CallerID: call.CallerID,
                                Call: call
                            })
                        })
                    })

                    return orderBy(data, function (q) {
                        return q.Call.JoinTimeStamp
                    }, ['asc']);
                },
                set: function (newValue) {
                    return newValue
                }
            },
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
                this.$refs['gauge-chart'].chart.exportChart({
                    type: type,
                })
            },
            async chartOptions() {
                if (isExternalDataWidget(this.data)) {
                    let data = await WidgetDataApi.getExternalData(this.data.EndPoint)
                    this.chartData = { ...gaugeChartConfig, ...{ series: data } }
                } else {
                    this.chartData = this.getAgentsData()
                }
                
                this.reDrawChart()
            },
            getAgentsData() {
                let queuesCount = this.getMaximumRange || this.allQueues.length
                
                let range = {
                    min: 0,
                    max: queuesCount,
                }
                
                let stops = [
                    [0, '#55BF3B'],
                    [queuesCount / 2 + 0.1, '#DDDF0D'],
                    [queuesCount, '#DF5353'],
                ]
                
                const labelFontSize = this.getLabelFontSize
                
                let yAxisConfig = {
                    ...gaugeChartConfig.yAxis,
                    ...this.data.yAxis,
                    ...range,
                    stops,
                    labels: {
                        y: labelFontSize * 1.2,
                        style: {
                            fontSize: labelFontSize,
                        },
                    },
                }
                
                const allQueueCalls = this.allQueueCalls.length
                
                const labelStyle = `style="font-size:${labelFontSize}px"`
                
                this.data.series = [{
                    data: [allQueueCalls],
                    dataLabels: {
                        style: {
                            fontSize: labelFontSize,
                        },
                        y: -35,
                        format:
                            '<div style="text-align:center">' +
                            `<span ${labelStyle}>{y}</span>&nbsp;` +
                            `<span>${this.$t("calls")}</span>` +
                            '</div>',
                    },
                }]
                
                return { ...gaugeChartConfig, ...this.data, ...{ yAxis: yAxisConfig } }
            },
            triggerResizeEvent() {
                bus.$on('widget-resized', (widgetID) => {
                    if (this.data.WidgetID.toString() !== widgetID.toString()) {
                        return;
                    }
                    this.reDrawChart()
                });
            },
            reDrawChart() {
                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            },
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.chartOptions()
                },
            },
            allQueues() {
                this.chartOptions()
            },
        },
        mounted() {
            if (!this.data.WidgetLayout.showQueues) {
                this.$set(this.data.WidgetLayout, 'showQueues', this.allQueues.map((el) => el.QueueID))
            }
            this.triggerResizeEvent()
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.chartOptions()
                }, this.data.DefaultRefreshInterval)
            }
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
<style lang="scss">
.gouge-wrapper {
    max-height: 300px;
}
</style>
