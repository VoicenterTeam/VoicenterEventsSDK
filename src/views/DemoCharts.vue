<template>
    <div>
        <tabs :circular-timeout="circularTimeout" :tabs="tabs">
            <template v-slot="{tab, index}">
                <component :is="tab.component" :chartData="tab.data" :chartIndex="index"></component>
            </template>
        </tabs>
    </div>
</template>
<script>

    import TimeLineChart from '@/components/charts/TimeLineChart'
    import GanttChart from '@/components/charts/GanttChart'
    import Tabs from '@/components/Tabs'

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
            Tabs
        },
        data() {
            return {
                activeTab: 'first',
                timeoutId: null,
            };
        },
        computed: {
            reportSettings() {
                return this.$store.state.settings.report
            },
            circularTimeout() {
                if (this.$store.state.settings.report.switching) {
                    return this.reportSettings.interval
                } else {
                    return null
                }
            },
            tabs() {
                //TODO: api object structure is needed to view
                let data = [{
                    name: 'first',
                    label: 'First',
                    data: this.charts[0],
                    component: 'TimeLineChart'
                }, {
                    name: 'second',
                    label: 'Second',
                    data: this.charts[1],
                    component: 'GanttChart'
                }]
                return this.$rtl.isRTL ? data.reverse() : data
            }
        },
        methods: {
            syncChartData(settings) {
                clearInterval(this.timeoutId)
                if (settings.refresh) {
                    //TODO: CHECK API - get one chart data
                    this.timeoutId = setInterval(() => {
                        this.$store.dispatch('charts/getAllCharts')
                    }, settings.interval * 1000)
                }
            },
        },
        watch: {
            reportSettings: {
                immediate: true,
                handler: function (settings) {
                    this.syncChartData(settings)
                }
            }
        },
        beforeDestroy() {
            clearInterval(this.timeoutId)
        }
    }
</script>
<style>
</style>
