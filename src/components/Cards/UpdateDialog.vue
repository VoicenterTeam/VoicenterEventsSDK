<template>
    <el-dialog v-bind="$attrs" v-on="$listeners" :width="setWidth">
        <h5 slot="title" class="text-main-2xl font-semibold text-gray-700">{{$t('extensionCard.update')}}</h5>
        <div class="flex items-center my-4">
            <slot name="header"/>
        </div>
        <div class="w-full flex flex-col">
            <slot name="content"/>
        </div>
        <template slot="footer">
            <slot name="footer"/>
        </template>
        <el-collapse v-model="activeCollapse" class="pt-4">
            <el-collapse-item :title="$t('widget.layout')" name="layout">
                <div class="flex flex-col">
                    <label class="pt-3 pb-2">{{$t('Widget width')}}</label>
                    <slot name="width"/>
                </div>
                <widget-colors :model="model" :onlyBackground="true"/>
            </el-collapse-item>
        </el-collapse>
    </el-dialog>
</template>
<script>
    import {Collapse, CollapseItem, Dialog} from 'element-ui'
    import WidgetColors from '../Widgets/WidgetUpdateForm/WidgetLayout/WidgetColors'

    export default {
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            WidgetColors,
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            setWidth() {
                if (this.isMobileOrTablet) {
                    return '80%'
                } else {
                    return '40%'
                }
            }
        },
        data() {
            return {
                activeCollapse: ['layout']
            }
        }
    }
</script>
