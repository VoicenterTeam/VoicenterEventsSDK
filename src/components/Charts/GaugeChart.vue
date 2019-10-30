<template>
    <div class="w-full p-4 bg-white rounded-lg shadow">
        <div class="relative cursor-pointer z-50" v-if="editable">
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                <trash-icon class="w-8 h-8 p-2 text-red trash-icon"
                            @click="$emit('remove-item')">
                </trash-icon>
            </el-tooltip>
        </div>
        <div class="z-10" :class="{'-mt-8':editable}">
            <highcharts :options="chartOptions"></highcharts>
        </div>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import {TrashIcon} from 'vue-feather-icons'
    import gaugeChartConfig from './Configs/Gauge'
    import {LOGOUT_STATUS} from '@/enum/extensionStatuses'
    import highchartsMoreInit from 'highcharts/highcharts-more'
    import solidGaugeInit from 'highcharts/modules/solid-gauge'

    highchartsMoreInit(Highcharts)
    solidGaugeInit(Highcharts)

    export default {
        components: {
            TrashIcon,
            highcharts: Chart,
            [Tooltip.name]: Tooltip,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: true
            },
        },
        computed: {
            agentsOnline() {
                return this.$store.state.extensions.extensions.filter((e) => e.representativeStatus !== LOGOUT_STATUS)
            },
            agentsInACall() {
                debugger
                return this.agentsOnline.filter(agent => agent.calls.length)
            },
            chartOptions() {
                let agentsOnline = this.agentsOnline
                let range = {
                    min: 0,
                    max: agentsOnline.length
                }

                let stops = [
                    [0, '#55BF3B'],
                    [agentsOnline.length/2 + 0.1, '#DDDF0D'],
                    [agentsOnline.length, '#DF5353']
                ]
                let yAxisConfig = {
                    ...gaugeChartConfig.yAxis,
                    ...this.data.yAxis,
                    ...range,
                    stops,
                }
                this.data.series = [{data: [this.agentsInACall ? this.agentsInACall.length : 0]}]
                return {...gaugeChartConfig, ...this.data, ...{yAxis: yAxisConfig}}
            },
        },
    }
</script>
