<template>
    <div class="pt-2 widget-color-picker">
        <label class="text-main-sm">
            {{ $t('Widget colors') }}
        </label>
        <div class="flex pt-2 items-center">
            <widget-color
                v-for="(option, index) of getWidgetColors"
                :key="index"
                v-model="model.colors[option]"
                :option="option"
                :predefinedColors="predefinedColors">
                <template v-slot:default>
                    <slot></slot>
                </template>
            </widget-color>
        </div>
    </div>
</template>
<script>
    import uniq from 'lodash/uniq'
    import values from 'lodash/values'
    import { defaultWidgetColors } from '@/enum/layout';
    import WidgetColor from "@/components/Widgets/WidgetUpdateForm/WidgetLayout/WidgetColor";

    const BACKGROUND_COLOR_KEY = ['background'];

    export default {
        components: {
            WidgetColor,
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
            availableColors: {
                type: Array,
                default: () => defaultWidgetColors,
            },
        },
        computed: {
            predefinedColors() {
                let options = values(this.$store.getters['layout/colors'])
                return uniq(options)
            },
            getWidgetColors() {
                if (this.onlyBackground) {
                    return BACKGROUND_COLOR_KEY
                }
                return this.availableColors
            },
        }
    }
</script>
<style lang="scss" scoped>
.widget-color-picker ::v-deep {
    .el-color-picker__trigger {
        @apply w-24;
        border: none;

        .el-color-picker__color {
            border: none;
        }

        .el-icon-arrow-down:before,
        .el-icon-close:before {
            font-family: Montserrat;
            font-weight: 600;
            content: "Change";
            color: var(--gray-550);
        }

        .el-color-picker__color-inner {
            @apply rounded;
            background: white !important;
            border: 2px solid var(--gray-550);
            color: var(--gray-550);

        }

        &:hover {
            .el-icon-arrow-down:before,
            .el-icon-close:before {
                color: var(--primary-color);
            }

            .el-color-picker__color-inner {
                border: 2px solid var(--primary-color);
                color: var(--primary-color);
            }
        }
    }

    .el-color-dropdown__link-btn {
        padding: 0 !important;
    }
}
</style>
<style lang="scss">
.rtl {
    .el-color-picker__panel .el-color-predefine {
        .el-color-predefine__color-selector {
            @apply mx-1;
        }
    }
    .el-color-dropdown__main-wrapper {
        .el-color-hue-slider {
            float: left !important;
        }
    }
    .el-color-dropdown__btns {
        .el-button--default {
            @apply mx-2;
        }
    }
}
</style>
