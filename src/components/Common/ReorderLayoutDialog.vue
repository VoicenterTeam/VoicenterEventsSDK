<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-xl font-medium text-gray-700">{{$t('tooltip.reorder.dashboard.layout')}}</h3>
        <el-collapse v-model="activeCollapses" class="w-full">
            <DraggableList group="widgetGroups"
                           :value="widgetGroups"
                           @change="(ev) => onGroupListChange(ev)">
                <el-collapse-item v-for="(widgetGroup, groupIndex) in widgetGroups"
                                  :title="widgetGroup.WidgetGroupTitle"
                                  :name="widgetGroup.WidgetGroupTitle" class="w-full p-2 widget-group"
                                  :key="groupIndex">

                    <DraggableList group="widgets"
                                   :value="widgetGroup.WidgetList"
                                   @change="(ev) => onWidgetListChange(ev, widgetGroup, groupIndex)">
                        <div v-for="widget in widgetGroup.WidgetList" class="w-full p-2" :key="widget.WidgetID">
                            <div class="widget-item">
                                {{widget.Title}}
                            </div>
                        </div>
                    </DraggableList>
                </el-collapse-item>
            </DraggableList>
        </el-collapse>
        <template slot="footer">
            <el-button @click="$emit('on-cancel')">{{$t('common.cancel')}}</el-button>
            <el-button @click="onSubmit()" type="primary">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import differenceBy from 'lodash/differenceBy'
    import {Dialog, Collapse, CollapseItem} from 'element-ui'
    import DraggableList from '../Widgets/DraggableList'
    import draggableEvents from '@/enum/draggableEvents'

    export default {
        components: {
            [Dialog.name]: Dialog,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            DraggableList
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
                widgetGroups: cloneDeep(this.widgetGroupList),
                widgetsToUpdate: []
            }
        },
        mounted() {
            // TODO: to be defined
            // this.activeCollapses = this.widgetGroupList.map((el) => el.WidgetGroupTitle)
        },
        methods: {
            onGroupListChange(ev) {
                let eventData = ev[draggableEvents.MOVED],
                    {newIndex: newIndex, oldIndex: oldIndex} = eventData
                this.widgetGroups.splice(newIndex, 0, this.widgetGroups.splice(oldIndex, 1)[0]);
            },
            onSubmit() {
                this.widgetGroups.forEach((group, index) => {
                    group.Order = index + 1
                    group.WidgetList.forEach((widget, _index) => {

                        let oldWidget = group.WidgetList.find((el) => el.WidgetID === widget.WidgetID)
                        if (oldWidget.WidgetLayout.Order !== _index + 1) {
                            widget.WidgetLayout.Order = _index + 1
                            this.widgetsToUpdate.push(widget);
                        }
                    })
                })

                let widgetGroupsToUpdate = differenceBy(this.widgetGroups, this.widgetGroupList, 'Order')

                let objectToEmit = {
                    groupsToUpdate: widgetGroupsToUpdate,
                    widgetsToUpdate: this.widgetsToUpdate,
                    allGroups: this.widgetGroups,
                }

                this.$emit('on-submit', objectToEmit)
            },

            onWidgetListChange(ev, group, groupIndex) {
                let action = get(Object.keys(ev), 0),
                    eventData = ev[action],
                    {element: widget, newIndex: newIndex, oldIndex: oldIndex} = eventData;

                switch (action) {
                    case draggableEvents.MOVED:
                        this.widgetGroups[groupIndex].WidgetList.splice(newIndex, 0, group.WidgetList.splice(oldIndex, 1)[0])
                        break;
                    case draggableEvents.ADDED:
                        this.widgetGroups[groupIndex].WidgetList.splice(newIndex, 0, widget)
                        break;
                    case draggableEvents.REMOVED:
                        this.widgetGroups[groupIndex].WidgetList.splice(oldIndex, 1)
                        break;
                }

                if (action !== draggableEvents.MOVED) {
                    this.widgetsToUpdate.push({
                        ...widget,
                        ...{
                            operation: {
                                type: action,
                                parentID: group.WidgetGroupID
                            }
                        }
                    })
                }
            },
        }
    }
</script>
<style lang="scss">
    .widget-item {
        border: 1px dashed;
        border-radius: 4px;
        @apply bg-gray-100 w-full p-2;
    }

    .flex-wrap > .el-collapse-item.widget-group {
        margin-bottom: 0;
    }
</style>
