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
                <div class="py-4">
                    <label>{{$t('Card title font size')}}</label>
                    <el-slider
                        :marks="titleBestOptions"
                        :max="titleFontSizes.max"
                        :min="titleFontSizes.min"
                        show-input
                        v-model="layoutConfig.titleFontSize">
                    </el-slider>
                </div>
                <div class="py-4">
                    <label>{{$t('Card value font size')}}</label>
                    <el-slider
                        :marks="valueBestOptions"
                        :max="valueFontSizes.max"
                        :min="valueFontSizes.min"
                        show-input
                        v-model="layoutConfig.valueFontSize">
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
    import {InfoIcon} from 'vue-feather-icons'
    import Modal from '@/components/Common/Modal'
    import {Collapse, CollapseItem, Popover, Slider} from 'element-ui'
    import StaticWidgetInfo from '../Widgets/WidgetUpdateForm/StaticWidgetInfo'
    import WidgetColors from '../Widgets/WidgetUpdateForm/WidgetLayout/WidgetColors'

    export default {
        inheritAttrs: false,
        components: {
            Modal,
            InfoIcon,
            WidgetColors,
            StaticWidgetInfo,
            [Slider.name]: Slider,
            [Popover.name]: Popover,
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
                    return '45%'
                }
            },
        },
        data () {
            return {
                activeCollapse: ['layout'],
                titleFontSizes: {
                    min: 12,
                    max: 150
                },
                titleBestOptions: {
                    16: '16px',
                    32: '32px',
                    56: '56px',
                    72: '72px',
                    96: '96px',
                    112: '112px',
                    136: '136px',
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
        },
    }
</script>
