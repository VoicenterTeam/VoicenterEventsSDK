<template>
    <div v-if="tabs.length">
        <tabs :circular-timeout="circularTimeout" :tabs="tabs" v-on="$listeners" :newActiveTab="activeTab">
            <template v-slot="{tab, activeTab}">
                <component :is="widgetsViewMode"
                           v-if="activeTab.toString() === tab.WidgetGroupID.toString()"
                           :widgets="tab.WidgetList"
                           :editable="editMode"
                           v-bind="$attrs"
                           :widget-group="tab"
                           :class="getClass(tab.WidgetList)"
                           v-on="$listeners">
                </component>
            </template>
        </tabs>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import uniq from 'lodash/uniq'
    import Tabs from '@/components/Tabs'
    import widgetViewTypes from '@/enum/widgetViewTypes'
    import {getWidgetDataType} from '@/helpers/widgetUtils'
    import WidgetList from '@/components/Widgets/WidgetList'
    import WidgetTabs from '@/components/Widgets/WidgetTabs'

    export default {
        components: {
            WidgetList,
            WidgetTabs,
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
            activeTab: [String, Number]
        },
        computed: {
            dashboardSettings() {
                return this.$store.state.dashboards.settings
            },
            reportSettings() {
                return this.dashboardSettings.report
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
            },
            widgetsViewMode() {
                let showWidgetAsTabs = get(this.dashboardSettings, 'showWidgetAsTabs')
                if (showWidgetAsTabs && !this.editMode) {
                    return widgetViewTypes.TABS
                }
                return widgetViewTypes.LIST
            },
        },
        methods: {
            getClass(widgets) {
                if (widgets.length) {
                    let tabsToDisplay = uniq(widgets.map((widget) => {
                        return getWidgetDataType(widget)
                    }))
                    if (tabsToDisplay.length > 1) {
                        return 'display-widget__tabs'
                    }
                }
                return ''
            }
        }
    }
</script>
