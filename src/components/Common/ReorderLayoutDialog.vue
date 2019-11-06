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
            <el-button @click="onSubmit()" type="primary">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import draggable from 'vuedraggable'
    import cloneDeep from 'lodash/cloneDeep'
    import differenceBy from 'lodash/differenceBy'
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
                widgetGroups: cloneDeep(this.widgetGroupList)
            }
        },
        mounted() {
            //TODO: TBD
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
                })

                let widgetGroupsToUpdate = differenceBy(this.widgetGroups, this.widgetGroupList, 'Order')

                let objectToEmit = {
                    groupsToUpdate: widgetGroupsToUpdate,
                    allGroups: this.widgetGroups
                }

                this.$emit('on-submit', objectToEmit)
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
