<template>
    <div v-if="tabs.length && !storingData" class="w-full">
        <tabs :circular-timeout="circularTimeout" :tabs="tabs" v-on="$listeners" :newActiveTab="activeTab">
            <template v-slot="{ tab, activeTab }">
                <div v-if="editMode"
                     :key="tab.WidgetGroupID"
                     class="flex items-center justify-between px-2 pb-2">
                    <base-outline-input v-model="tab.WidgetGroupTitle" />
                    <edit-group-buttons
                        :activeWidgetGroupId="activeTab"
                        :widget-groups="tabs"
                        :widget-group="tab"
                        @on-reorder-widget-group="onReorderWidgetGroup"
                        v-on="$listeners">
                    </edit-group-buttons>
                </div>
                <widget-list
                    :editable="editMode"
                    :widget-group="tab"
                    :widgetTemplates="widgetTemplates"
                    :widgets="tab.WidgetList"
                    v-bind="$attrs"
                    v-if="activeTab.toString() === tab.WidgetGroupID.toString() && showComponent"
                    v-on="$listeners">
                </widget-list>
            </template>
        </tabs>
    </div>
</template>
<script>   
    export default {
        components: {
            EditGroupButtons: () => import('@/components/EditGroupButtons'),
            WidgetList: () => import('@/components/Widgets/WidgetList'),
            Tabs: () => import('@/components/Tabs')
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
        data () {
            return {
                showComponent: true
            }
        },
        computed: {
            circularTimeout() {
                const reportSwitching = this.$store.getters['layout/switchReport']('activeLayout')
                if (reportSwitching) {
                    return this.$store.getters['layout/switchInterval']('activeLayout')
                } else {
                    return null
                }
            },
            tabs() {
                let data = this.widgetGroupList
                return this.$rtl.isRTL ? data.reverse() : data
            },
        },
        methods: {
            onReorderWidgetGroup (data) {
                this.showComponent = false
                this.$nextTick(() => {
                    this.showComponent = true
                    this.$emit('on-reorder-widget-group')
                })
            }
        }
    }
</script>
