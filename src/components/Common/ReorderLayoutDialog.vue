<template>
    <modal v-bind="$attrs" v-on="$listeners">
        <div class="flex items-center">
            <h3 class="text-main-xl font-medium text-gray-700" slot="title">
                {{$t('tooltip.reorder.dashboard.layout')}}</h3>
            <el-popover
                :width="popoverWidth"
                class="mx-2"
                placement="bottom-start"
                trigger="hover">
                {{$t('Move widget to another group')}}
                <AlertTriangleIcon class="text-orange-400 cursor-help" slot="reference"></AlertTriangleIcon>
            </el-popover>
        </div>
        <el-collapse class="w-full reorder-layout" v-model="activeCollapses">
            <DraggableList :value="widgetGroups"
                           @change="(ev) => onGroupListChange(ev)"
                           group="widgetGroups">
                <el-collapse-item :key="groupIndex"
                                  :name="widgetGroup.WidgetGroupTitle"
                                  :title="$t(widgetGroup.WidgetGroupTitle)" class="w-full p-2 widget-group"
                                  v-for="(widgetGroup, groupIndex) in widgetGroups">
                    <DraggableList :value="widgetGroup.WidgetList"
                                   @change="(ev) => onWidgetListChange(ev, widgetGroup, groupIndex)"
                                   group="widgets">
                        <div :key="widget.WidgetID" class="w-full flex justify-between items-center items my-1"
                             v-for="widget in widgetGroup.WidgetList">
                            <div :style="$store.getters['dashboards/widgetTitleStyles']" class="widget-item p-1">
                                {{$t(widget.Title)}}
                            </div>
                            <el-tooltip :content="$t('tooltip.remove.widget')" class="item" effect="dark"
                                        placement="top">
                                <button
                                    @click="removeWidget(widget, widgetGroup)"
                                    class="btn p-2 shadow rounded bg-white hover:bg-red-100 mx-1">
                                    <XIcon class="w-5 h-5 text-red"></XIcon>
                                </button>
                            </el-tooltip>
                        </div>
                    </DraggableList>
                </el-collapse-item>
            </DraggableList>
        </el-collapse>
        <template slot="footer">
            <el-button @click="$emit('on-cancel')">{{$t('common.cancel')}}</el-button>
            <el-button @click="onSubmit()" type="primary">{{$t('common.save')}}</el-button>
        </template>
    </modal>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import differenceBy from 'lodash/differenceBy'
    import {Collapse, CollapseItem, Popover, Tooltip} from 'element-ui'
    import Modal from "@/components/Common/Modal";
    import DraggableList from '../Widgets/DraggableList'
    import draggableEvents from '@/enum/draggableEvents'
    import {AlertTriangleIcon, XIcon} from 'vue-feather-icons'

    export default {
        components: {
            Modal,
            AlertTriangleIcon,
            [Popover.name]: Popover,
            XIcon,
            [Tooltip.name]: Tooltip,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            DraggableList,
        },
        props: {
            widgetGroupList: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                activeCollapses: [],
                popoverWidth: 300,
                widgetGroups: [],
                widgetsToUpdate: []
            }
        },
        methods: {
            removeWidget (widget, widgetGroup) {
                this.$emit('removeWidget', {'widget': widget, 'group': widgetGroup})
            },
            onGroupListChange (ev) {
                let eventData = ev[draggableEvents.MOVED]
                let {newIndex: newIndex, oldIndex: oldIndex} = eventData

                this.widgetGroups.splice(newIndex, 0, this.widgetGroups.splice(oldIndex, 1)[0]);
            },
            onSubmit () {
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

            onWidgetListChange (ev, group, groupIndex) {
                let action = get(Object.keys(ev), 0)
                let eventData = ev[action]
                let {element: widget, newIndex: newIndex, oldIndex: oldIndex} = eventData;

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
                    widget = cloneDeep(widget)
                    widget['operation'] = {
                        type: action,
                        parentID: group.WidgetGroupID
                    }

                    this.widgetsToUpdate.push(widget)
                }
            },
        },
        watch: {
            widgetGroupList: {
                deep: true,
                immediate: true,
                handler (value) {
                    this.widgetGroups = cloneDeep(value)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .items {
        @apply flex bg-gray-100 w-full p-2;
        border: 1px dashed;
        border-radius: 4px;
    }

    .flex-wrap > .el-collapse-item.widget-group {
        margin-bottom: 0;
    }
</style>
