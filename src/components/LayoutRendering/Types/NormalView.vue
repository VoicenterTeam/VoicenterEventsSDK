<template>
    <div :key="dashboardKey">
        <transition-group name="flip-list">
            <div v-for="widgetGroup in activeDashboardData.WidgetGroupList" :key="widgetGroup.WidgetGroupID"
                 class=""
                 :class="{'editable-widgets px-2 sm:px-8':editMode}">
                <div v-if="editMode" class="flex items-center justify-between">
                    <base-input v-model="widgetGroup.WidgetGroupTitle"/>
                    <edit-group-buttons
                            v-on="$listeners"
                            :widgetGroup="widgetGroup">
                    </edit-group-buttons>
                </div>
                <h3 v-else class="font-semibold text-main-2xl text-gray-800"
                    :style="$store.getters['dashboards/widgetTitleStyles']">
                    {{widgetGroup.WidgetGroupTitle}}
                </h3>
                <widget-list
                        :widgets="widgetGroup.WidgetList"
                        :widgetTemplates="widgetTemplates"
                        :editable="editMode"
                        v-bind="$attrs"
                        :widget-group="widgetGroup"
                        v-on="$listeners">
                </widget-list>
            </div>
        </transition-group>
    </div>
</template>
<script>
    import BaseInput from '@/components/BaseInput'
    import WidgetList from '@/components/Widgets/WidgetList'
    import EditGroupButtons from '@/components/EditGroupButtons'

    export default {
        components: {
            EditGroupButtons,
            BaseInput,
            WidgetList
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
            widgetTemplates: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            dashboardKey() {
                return this.activeDashboardData.ID
            },
        }
    }
</script>

<style scoped>

</style>
