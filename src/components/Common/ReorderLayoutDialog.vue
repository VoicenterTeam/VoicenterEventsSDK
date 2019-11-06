<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-xl font-medium text-gray-700">{{$t('tooltip.reorder.dashboard.layout')}}</h3>

        <el-collapse v-model="activeCollapses">
            <draggable
                group="widgetGroupList"
                :value="widgetGroupList"
                @change="(ev) => onGroupListChange(ev)">
                <el-collapse-item v-for="(widgetGroup, index) in widgetGroupList" :title="widgetGroup.WidgetGroupTitle"
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
                activeCollapses: []
            }
        },
        mounted() {
            this.activeCollapses = this.widgetGroupList.map((el) => el.WidgetGroupTitle)
        },
        methods: {
            onGroupListChange(ev) {
                this.$emit('reorder-group', ev.moved)
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
