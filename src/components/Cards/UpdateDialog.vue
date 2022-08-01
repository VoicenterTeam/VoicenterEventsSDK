<template>
<modal :width="setWidth" v-bind="$attrs" v-on="$listeners" :append-to-body="true">
    <template v-slot:title>
        <div class="flex flex-row items-center">
            <h5 class="text-main-2xl font-semibold text-gray-700" slot="title">{{ $t('extensionCard.update') }}</h5>
            <static-widget-info :widget="model" class="px-2"/>
        </div>
    </template>
    <slot name="header"/>
    <div class="w-full flex flex-col pt-4">
        <slot name="content"/>
    </div>
    <el-collapse class="pt-2" v-model="activeCollapse">
        <el-collapse-item :title="$t('widget.layout')" name="layout">
            <div class="py-4">
                <div>
                    <label>{{ $t('widget.config.cardTitleFontSize') }}</label>
                </div>
                <el-input-number
                    :max="titleFontSizes.max"
                    :min="titleFontSizes.min"
                    :step="1"
                    size="small"
                    v-model="layoutConfig.titleFontSize"
                    placeholder="0"
                >
                </el-input-number>
            </div>
            <div class="py-4">
                <div>
                    <label>{{ $t('widget.config.cardValueFontSize') }}</label>
                </div>
                <el-input-number
                    :max="valueFontSizes.max"
                    :min="valueFontSizes.min"
                    :step="1"
                    size="small"
                    v-model="layoutConfig.valueFontSize"
                    placeholder="0"
                >
                </el-input-number>
            </div>
            <div class="py-4">
                <div>
                    <label>{{ $t('widget.config.valueIconMinWidth') }}</label>
                </div>
                <el-input-number
                    :step="1"
                    :max="valueMinWidth.max"
                    :min="valueMinWidth.min"
                    size="small"
                    v-model="layoutConfig.valueIconMinWidth"
                    placeholder="0"
                >
                </el-input-number>
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
import { InfoIcon } from 'vue-feather-icons'
import { Collapse, CollapseItem, Popover, InputNumber } from 'element-ui'

export default {
    inheritAttrs: false,
    components: {
        Modal: () => import('@/components/Common/Modal'),
        InfoIcon,
        WidgetColors: () => import('../Widgets/WidgetUpdateForm/WidgetLayout/WidgetColors'),
        StaticWidgetInfo: () => import('../Widgets/WidgetUpdateForm/StaticWidgetInfo'),
        [InputNumber.name]: InputNumber,
        [Popover.name]: Popover,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
    },
    props: {
        model: {
            type: Object,
            default: () => ({}),
        },
        onlyBackground: {
            type: Boolean,
            default: false,
        },
        layoutConfig: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        setWidth() {
            if (this.isMobileOrTablet) {
                return '80%'
            } else {
                return '45%'
            }
        },
    },
    data() {
        return {
            activeCollapse: ['layout'],
            titleFontSizes: {
                min: 12,
                max: 150,
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
                max: 128,
            },
            valueBestOptions: {
                32: '32px',
                48: '48px',
                64: '64px',
                80: '80px',
                96: '96px',
                112: '112px',
            },
            valueMinWidth: {
                min: 24,
                max: 128
            }
        }
    },
}
</script>
