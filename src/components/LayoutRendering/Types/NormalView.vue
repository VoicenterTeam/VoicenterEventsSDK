<template>
    <div :key="activeDashboardData.ID">
        <transition-group name="flip-list">
            <div v-for="widgetGroup in activeDashboardData.WidgetGroupList" :key="widgetGroup.WidgetGroupID"
                 class="my-10 px-2 sm:px-8"
                 :class="{'editable-widgets':editMode}">
                <div v-if="editMode" class="flex items-center justify-between mb-8">
                    <base-input v-model="widgetGroup.WidgetGroupTitle"></base-input>
                    <edit-group-buttons
                        v-on="$listeners"
                        :widgetGroup="widgetGroup">
                    </edit-group-buttons>
                </div>
                <h3 v-else class="font-semibold text-2xl text-gray-800">{{widgetGroup.WidgetGroupTitle}}</h3>
                <widget-list
                    :widgets="widgetGroup.WidgetList"
                    :all-widgets="allWidgets"
                    :editable="editMode"
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
            allWidgets: {
                type: Array,
                default: () => ([])
            }
        }
    }
</script>

<style scoped>

</style>
