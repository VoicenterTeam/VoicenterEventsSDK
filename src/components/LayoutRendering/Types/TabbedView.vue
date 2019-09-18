<template>
    <div>
        <tabs :circular-timeout="circularTimeout" :tabs="tabs" v-on="$listeners" :newActiveTab="activeTab">
            <template v-slot="{tab, activeTab}">
                <widget-list
                    :widgets="tab.WidgetList"
                    :all-widgets="allWidgets"
                    :editable="editMode"
                    v-bind="$attrs"
                    :widget-group="tab"
                    v-on="$listeners">
                </widget-list>
            </template>
        </tabs>
    </div>
</template>
<script>

    import Tabs from '@/components/Tabs'
    import WidgetList from '@/components/Widgets/WidgetList'

    export default {
        components: {
            WidgetList,
            Tabs
        },
        props: {
            activeDashboardData: {
                type: Object,
                default: () => ({})
            },
            editMode: {
                type: Boolean,
                default: false
            },
            allWidgets: {
                type: Array,
                default: () => ([])
            },
            activeTab: String
        },
        data() {
            return {
                timeoutId: null
            };
        },
        computed: {
            reportSettings() {
                return this.$store.state.dashboards.settings.report
            },
            circularTimeout() {
                if (this.$store.state.dashboards.settings.report.switching) {
                    return this.reportSettings.interval
                } else {
                    return null
                }
            },
            tabs() {
                let data = this.activeDashboardData.WidgetGroupList
                return this.$rtl.isRTL ? data.reverse() : data
            }
        },
        methods: {
            syncChartData(settings) {
                clearInterval(this.timeoutId)
                //TODO: CHECK API - get one chart data
                // if (settings.refresh) {
                //     this.timeoutId = setInterval(() => {
                //         this.$store.dispatch('charts/getAllCharts')
                //     }, settings.interval * 1000)
                // }
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

<style scoped>

</style>
