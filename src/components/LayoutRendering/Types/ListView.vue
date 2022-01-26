<template>
    <div v-if="!storingData">
        <transition-group name="flip-list">
            <div :class="{'editable-widgets':editMode}"
                 v-for="(widgetGroup, index) in widgetGroupList"
                 :key="`${index}-${widgetGroup.WidgetGroupID}`"
                 class="widget--group_section mb-3 relative">
                <div class="widget--group_border"/>
                <div class="p-2">
                    <div v-show="editMode && (editedGroup.WidgetGroupID === widgetGroup.WidgetGroupID)"
                        class="flex items-center justify-between pb-2">
                        <base-outline-input v-model="widgetGroup.WidgetGroupTitle"/>
                        <edit-group-buttons
                            :widgetGroup="widgetGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            @on-reorder-widget-group="onReorderWidgetGroup">
                        </edit-group-buttons>
                    </div>
                    <div v-show="!editMode" class="flex items-center justify-between pb-2">
                        <h3 :style="getStyles"
                            class="font-semibold text-main-2xl text-gray-800">
                            {{ widgetGroup.WidgetGroupTitle }}
                        </h3>
                        <ActionsListView :key="`group-actions-${index}`"
                                         v-on="$listeners"
                                         :group="widgetGroup"/>
                    </div>
                    <widget-list
                        v-if="showComponent"
                        :editable="editMode && (editedGroup.WidgetGroupID === widgetGroup.WidgetGroupID)"
                        :widget-group="widgetGroup"
                        :widgetTemplates="widgetTemplates"
                        :widgets="widgetGroup.WidgetList"
                        v-bind="$attrs"
                        v-on="$listeners"/>
                </div>
            </div>
        </transition-group>
    </div>
</template>
<script>
    import WidgetList from '@/components/Widgets/WidgetList'
    import EditGroupButtons from '@/components/EditGroupButtons'
    import ActionsListView from '@/components/LayoutRendering/ActionsListView'

    export default {
        components: {
            EditGroupButtons,
            ActionsListView,
            WidgetList,
        },
        props: {
            editMode: {
                type: Boolean,
                default: false,
            },
            editedGroup: {
                type: [Object, Array],
                default: () => {}
            },
            widgetTemplates: {
                type: Array,
                default: () => [],
            },
            widgetGroupList: {
                type: Array,
                default: () => [],
            },
            storingData: {
                type: Boolean,
                default: false,
            },
        },
        data () {
            return {
                showComponent: true
            }
        },
        computed: {
            getStyles() {
                return this.$store.getters['layout/widgetGroupTitleStyles']
            },
        },
        methods: {
            onReorderWidgetGroup () {
                this.showComponent = false
                this.$nextTick(() => {
                    this.showComponent = true
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.widget--group_section {
    @apply border border-gray-650 rounded;
    border-top: none;

    .widget--group_border {
        @apply absolute bg-primary h-1;
        width: calc(100% + 2px);
        margin: auto -1px auto -1px;
        border-radius: 4px 4px 0 0;
    }
}
</style>
