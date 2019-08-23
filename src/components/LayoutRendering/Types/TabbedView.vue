<template>
    <div>
        <tabs :circular-timeout="circularTimeout" :tabs="tabs">
            <template v-slot="{tab, index}">
                <widget-list
                        :widgets="tab.WidgetList"
                        :all-widgets="allWidgets"
                        :editable="editMode"
                        :widget-group="tab"
                        :chartIndex="index"
                        v-on="$listeners">
                </widget-list>
            </template>
        </tabs>
    </div>
</template>

<script>
    import get from 'lodash/get';
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
            }
        },
        data() {
            return {
                activeTab: get(this.activeDashboardData.WidgetGroupList, '[0].WidgetGroupID').toString(),
                timeoutId: null
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
                let data = this.activeDashboardData.WidgetGroupList
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

<style scoped>

</style>
