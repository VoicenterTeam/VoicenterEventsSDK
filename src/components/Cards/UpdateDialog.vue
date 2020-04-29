<template>
    <modal :width="setWidth" v-bind="$attrs" v-on="$listeners">
        <div class="flex flex-row items-center">
            <h5 class="text-main-2xl font-semibold text-gray-700" slot="title">{{$t('extensionCard.update')}}</h5>
            <static-widget-info :widget="model" class="px-2"/>
        </div>
        <slot name="header"/>
        <div class="w-full flex flex-col pt-4">
            <slot name="content"/>
        </div>
        <el-collapse class="pt-2" v-model="activeCollapse">
            <el-collapse-item :title="$t('widget.layout')" name="layout">
                <div class="flex flex-row">
                    <div>
                        <label>{{$t('Widget maximum width')}}</label>
                        <el-input class="mt-2" type="number" v-model="layoutConfig.maxWidth"/>
                    </div>
                    <div class="w-4"/>
                    <div>
                        <label>{{$t('Widget minimum width')}}</label>
                        <el-input class="mt-2" type="number" v-model="layoutConfig.minWidth"/>
                    </div>
                </div>
                <div class="flex flex-row pt-4">
                    <div>
                        <label>{{$t('Widget maximum height')}}</label>
                        <el-input class="mt-2" type="number" v-model="layoutConfig.maxHeight"/>
                    </div>
                    <div class="w-4"/>
                    <div>
                        <label>{{$t('Widget minimum height')}}</label>
                        <el-input class="mt-2" type="number" v-model="layoutConfig.minHeight"/>
                    </div>
                </div>
                <div class="py-4">
                    <label>{{$t('Card title font size')}}</label>
                    <el-slider
                        :min="titleFontSizes.min"
                        :max="titleFontSizes.max"
                        :marks="titleBestOptions"
                        v-model="layoutConfig.titleFontSize"
                        show-input>
                    </el-slider>
                </div>
                <div class="py-4">
                    <label>{{$t('Card value font size')}}</label>
                    <el-slider
                        :min="valueFontSizes.min"
                        :max="valueFontSizes.max"
                        :marks="valueBestOptions"
                        v-model="layoutConfig.valueFontSize"
                        show-input>
                    </el-slider>
                </div>
                <widget-colors :model="model" :onlyBackground="onlyBackground"/>
            </el-collapse-item>
        </el-collapse>
        <slot name="additional-data"/>
        <template slot="footer">
            <slot name="footer"/>
        </template>
    </modal>
</template>
<script>
    import Modal from "@/components/Common/Modal";
    import {Collapse, CollapseItem, Slider} from 'element-ui'
    import StaticWidgetInfo from '../Widgets/WidgetUpdateForm/StaticWidgetInfo'
    import WidgetColors from '../Widgets/WidgetUpdateForm/WidgetLayout/WidgetColors'

    export default {
        inheritAttrs: false,
        components: {
            Modal,
            WidgetColors,
            StaticWidgetInfo,
            [Slider.name]: Slider,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
            onlyBackground: {
                type: Boolean,
                default: false
            },
            layoutConfig: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            setWidth () {
                if (this.isMobileOrTablet) {
                    return '80%'
                } else {
                    return '40%'
                }
            },
        },
        data () {
            return {
                activeCollapse: ['layout'],
                titleFontSizes: {
                    min: 12,
                    max: 64
                },
                titleBestOptions: {
                    16: '16px',
                    24: '24px',
                    32: '32px',
                    48: '48px',
                    56: '56px',
                },
                valueFontSizes: {
                    min: 24,
                    max: 128
                },
                valueBestOptions: {
                    32: '32px',
                    48: '48px',
                    64: '64px',
                    80: '80px',
                    96: '96px',
                    112: '112px',
                },
            }
        }
    }
</script>
