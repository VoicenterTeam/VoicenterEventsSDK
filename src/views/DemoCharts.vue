<template>
    <div>
        <el-tabs>
            <el-tab-pane v-for="(chart, index) in charts" :label="chart.Type || 'line'">
                <TimeLineChart v-if="!chart.Type" :chartData="chart" :chartIndex="index"></TimeLineChart>
                <GanttChart v-if="chart.Type === 'gantt'" :chartData="chart" :chartIndex="index"></GanttChart>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>

    import {Tabs, TabPane} from 'element-ui'
    import TimeLineChart from '@/components/charts/TimeLineChart'
    import GanttChart from '@/components/charts/GanttChart'

    export default {
        props: {
            charts: {
                type: Array,
                default: () => []
            }
        },
        components: {
            TimeLineChart,
            GanttChart,
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane,
        },
        data() {
            return {
            };
        },
    }
</script>
<style>

</style>
