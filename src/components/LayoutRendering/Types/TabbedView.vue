<template>
    <div v-if="tabs.length && !storingData" class="w-full">
        <tabs :circular-timeout="circularTimeout" :tabs="tabs" v-on="$listeners" :newActiveTab="activeTab">
            <template v-slot="{tab, activeTab, index}">
                <div v-if="editMode"
                     :key="tab.WidgetGroupID"
                     class="flex items-center justify-between px-2 pb-2">
                    <base-outline-input v-model="tab.WidgetGroupTitle"/>
                    <edit-group-buttons :widget-groups="tabs"
                                        :widget-group="tab"
                                        v-on="$listeners">
                    </edit-group-buttons>
                </div>
                <widget-list
                    :editable="editMode"
                    :widget-group="tab"
                    :widgetTemplates="widgetTemplates"
                    :widgets="tab.WidgetList"
                    v-bind="$attrs"
                    v-if="activeTab.toString() === tab.WidgetGroupID.toString()"
                    v-on="$listeners">
                </widget-list>
            </template>
        </tabs>
    </div>
</template>
<script>
    import Tabs from '@/components/Tabs'
    import WidgetList from '@/components/Widgets/WidgetList'
    import EditGroupButtons from '@/components/EditGroupButtons'
    
    export default {
        components: {
            EditGroupButtons,
            WidgetList,
            Tabs,
        },
        props: {
            storingData: {
                type: Boolean,
                default: false,
            },
            widgetTemplates: {
                type: Array,
                default: () => [],
            },
            widgetGroupList: {
                type: Array,
                default: () => [],
            },
            editMode: {
                type: Boolean,
                default: false,
            },
            activeTab: [String, Number],
        },
        computed: {
            circularTimeout() {
                const reportSwitching = this.$store.getters['layout/switchReport']
                if (reportSwitching) {
                    return this.$store.getters['layout/switchInterval']
                } else {
                    return null
                }
            },
            tabs() {
                let data = this.widgetGroupList
                return this.$rtl.isRTL ? data.reverse() : data
            },
        },
    }
</script>
