<template>
    <div>
        <transition-group name="flip-list">
            <div v-for="widgetGroup in widgetGroupList" :key="widgetGroup.WidgetGroupID"
                 :class="{'editable-widgets px-2':editMode}">
                <div v-if="editMode" class="flex items-center justify-between">
                    <base-input v-model="widgetGroup.WidgetGroupTitle"/>
                    <edit-group-buttons
                            v-on="$listeners"
                            :widgetGroup="widgetGroup">
                    </edit-group-buttons>
                </div>
                <h3 v-else class="font-semibold text-main-2xl text-gray-800"
                    :style="$store.getters['dashboards/widgetGroupTitleStyles']">
                    {{widgetGroup.WidgetGroupTitle}}
                </h3>
                <widget-list
                        :widgets="widgetGroup.WidgetList"
                        :widgetTemplates="widgetTemplates"
                        :editable="editMode"
                        :widget-group="widgetGroup"
                        v-bind="$attrs"
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
            editMode: {
                type: Boolean,
                default: false
            },
            widgetTemplates: {
                type: Array,
                default: () => []
            },
            widgetGroupList: {
                type: Array,
                default: () => []
            },
        },
    }
</script>
