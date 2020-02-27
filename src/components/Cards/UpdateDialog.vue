<template>
    <modal v-bind="$attrs" v-on="$listeners" :width="setWidth">
        <div class="flex flex-row items-center">
            <h5 slot="title" class="text-main-2xl font-semibold text-gray-700">{{$t('extensionCard.update')}}</h5>
            <static-widget-info class="px-2" :widget="model"/>
        </div>
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
                    <slot name="width"/>
                </div>
                <widget-colors :model="model" :onlyBackground="true"/>
            </el-collapse-item>
        </el-collapse>
    </modal>
</template>
<script>
    import { Collapse, CollapseItem } from 'element-ui'
    import Modal from "@/components/Common/Modal";
    import StaticWidgetInfo from '../Widgets/WidgetUpdateForm/StaticWidgetInfo'
    import WidgetColors from '../Widgets/WidgetUpdateForm/WidgetLayout/WidgetColors'

    export default {
        inheritAttrs: false,
        components: {
            Modal,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            WidgetColors,
            StaticWidgetInfo,
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
