<template>
    <div v-if="!storingData">
        <transition-group name="flip-list">
            <div :class="{'editable-widgets px-2':editMode}" :key="index"
                 v-for="(widgetGroup, index) in widgetGroupList">
                <div class="flex items-center justify-between" v-if="editMode">
                    <base-input v-model="widgetGroup.WidgetGroupTitle"/>
                    <edit-group-buttons
                        :widgetGroup="widgetGroup"
                        v-on="$listeners">
                    </edit-group-buttons>
                </div>
                <h3 :style="$store.getters['dashboards/widgetGroupTitleStyles']"
                    class="font-semibold text-main-2xl text-gray-800"
                    v-else>
                    {{widgetGroup.WidgetGroupTitle}}
                </h3>
                <widget-list
                    :editable="editMode"
                    :widget-group="widgetGroup"
                    :widgetTemplates="widgetTemplates"
                    :widgets="widgetGroup.WidgetList"
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
            storingData: {
                type: Boolean,
                default: false
            },
        },
    }
</script>
