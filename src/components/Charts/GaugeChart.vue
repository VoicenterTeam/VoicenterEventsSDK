<template>
    <div class="bg-transparent pt-4 rounded-lg chart-content_wrapper"
         v-if="chartVisibility">
        <div class="chart-content_wrapper" ref="gauge-chart-container">
            <highcharts
                ref="gauge-chart"
                :options="chartData"
                :callback="onInitChartCallback"
                :updateArgs="[true, true]"
            />
        </div>
        <div class="mb-4" v-if="!!data.WidgetLayout.showWaitingTimeTable">
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
                this.$refs['gauge-chart'].chart.redraw()
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
                            `<span>${this.$t("general.calls")}</span>` +
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
                });
            },
            reDrawChart() {
                this.chartVisibility = false
                this.$nextTick(() => {
                    this.chartVisibility = true
                })
            },
            chartOptionsWithRefreshInterval () {
                if (this.fetchDataInterval) {
                    clearInterval(this.fetchDataInterval)
                }
                if (this.data.DefaultRefreshInterval) {
                    this.fetchDataInterval = setInterval(async() => {
                        await this.chartOptions()
                    }, this.data.DefaultRefreshInterval)
                }
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.chartOptionsWithRefreshInterval()
                },
            },
            allQueues() {
                this.chartOptionsWithRefreshInterval()
            },
        },
        mounted() {
            if (!this.data.WidgetLayout.showQueues) {
                this.$set(this.data.WidgetLayout, 'showQueues', this.allQueues.map((el) => el.QueueID))
            }
            this.triggerResizeEvent()
            this.chartOptions()
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
<style lang="scss">
.chart-content_wrapper .highcharts-container {
    width: 100% !important;
    height: auto !important;
}

.chart-content_wrapper .highcharts-root {
    width: 100% !important;
    height: 100% !important;
}
.chart-content_wrapper .highcharts-data-labels {
    width: 100% !important;
    height: 100% !important;
    left: 0 !important;
    top: 0 !important;
}
.chart-content_wrapper .highcharts-label {
    left: 50% !important;
    transform: translateX(-50%) !important;
    top: calc(80% - 0px) !important;
}
.chart-content_wrapper .highcharts-label > span {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
}

.chart-content_wrapper .highcharts-container::before {
    content: '';
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    max-height: 100%;
}
.chart-content_wrapper .highcharts-container > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
