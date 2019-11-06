<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-xl font-medium text-gray-700">{{$t('tooltip.reorder.dashboard.layout')}}</h3>
        <el-collapse v-model="activeCollapses">
            <draggable
                group="widgetGroups"
                :value="widgetGroups"
                @change="(ev) => onGroupListChange(ev)">
                <el-collapse-item v-for="(widgetGroup, index) in widgetGroups" :title="widgetGroup.WidgetGroupTitle"
                                  :name="widgetGroup.WidgetGroupTitle" class="cursor-move" :key="index">
                    <draggable
                        group="widgets"
                        :value="widgetGroup.WidgetList"
                        @change="(ev) => onWidgetListChange(ev)">
                        <div v-for="widget in widgetGroup.WidgetList" class="widget-item p-2 mb-2">
                            {{widget.Title}}
                        </div>
                    </draggable>
                </el-collapse-item>
            </draggable>
        </el-collapse>
        <template slot="footer">
            <el-button @click="$emit('on-cancel')">{{$t('common.cancel')}}</el-button>
            <el-button @click="$emit('on-submit')" type="primary">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import draggable from 'vuedraggable'
    import {Dialog, Collapse, CollapseItem} from 'element-ui'
    import draggableEvents from '@/enum/draggableEvents'

    export default {
        components: {
            [Dialog.name]: Dialog,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            draggable,
        },
        props: {
            widgetGroupList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                activeCollapses: [],
                widgetGroups: this.widgetGroupList
            }
        },
        mounted() {
            this.activeCollapses = this.widgetGroupList.map((el) => el.WidgetGroupTitle)
        },
        methods: {
            onGroupListChange(ev) {
                let eventData = ev[draggableEvents.MOVED],
                    {newIndex: newIndex, oldIndex: oldIndex} = eventData

                let WidgetGroupList = this.widgetGroups
                WidgetGroupList.splice(newIndex, 0, WidgetGroupList.splice(oldIndex, 1)[0]);

                if (oldIndex > 0) {
                    WidgetGroupList = this.widgetGroupList.slice(oldIndex)
                }
                let objectToEmit = {
                    groups: WidgetGroupList,
                    oldIndex: eventData.oldIndex
                }

                this.$emit('reorder-group', objectToEmit)
            },
            onWidgetListChange(ev) {

            },
        }
    }
</script>
<style lang="scss">
    .widget-item {
        border: 1px dashed;
        border-radius: 4px;
        @apply bg-gray-100;
    }
</style>
