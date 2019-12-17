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
            <highcharts :options="chartOptions"/>
        </div>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import {TrashIcon} from 'vue-feather-icons'
    import statusTypes from '@/enum/statusTypes'
    import groupBy from 'lodash/groupBy'

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
            extensions() {
                return this.$store.state.extensions.extensions
            },
            chartOptions() {

                let statusData = []
                let extensions = this.extensions

                if (extensions) {
                    statusData = groupBy(this.extensions, 'representativeStatus')
                }

                let data = []

                for (let status in statusData) {
                    let statusType = statusTypes[status]

                    let sliceObject = {
                        color: statusType.color,
                        name: this.$t(statusType.text),
                        y: statusData[status].length,
                    }

                    if (!data.length) {
                        sliceObject.sliced = true
                        sliceObject.selected = true
                    }

                    data.push(sliceObject);
                }

                return {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: this.$t('Agents real time status')
                    },
                    series: [{
                        name: this.$t('Agents'),
                        colorByPoint: true,
                        data: data
                    }]
                };
            },
        },
    }
</script>
