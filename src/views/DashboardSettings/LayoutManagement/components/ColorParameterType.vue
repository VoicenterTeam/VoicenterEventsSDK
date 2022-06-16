<template>
    <div class="grid grid-cols-2 gap-1 w-full py-2 items-center color-picker">
        <div class="col-span-1"
             v-if="displayLabel">
            <span class="text-main-sm whitespace-nowrap">
                {{ makePrefixForTranslation(LayoutParameterName) }}:
            </span>
        </div>
        <div class="flex items-center"
             :class="displayLabel ? 'col-span-1 justify-end': 'col-span-2'">
            <slot>
                <IconColorPicker class="w-5 h-5"
                                 :style="getIndicatorStyles"/>
            </slot>
            <el-color-picker class="mx-2"
                             :predefine="predefinedColors"
                             v-on="$listeners"
                             v-bind="$attrs"
            />
        </div>
    </div>
</template>
<script>
    import { ColorPicker } from 'element-ui'
    import { predefinedColors } from '../layout-management'

    export default {
        inheritAttrs: false,
        name: 'Color',
        components: {
            [ColorPicker.name]: ColorPicker,
        },
        props: {
            LayoutParameterName: {
                type: String,
                Default: '',
            },
            displayLabel: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                predefinedColors,
            }
        },
        computed: {
            getIndicatorStyles() {
                const config = this.$attrs
                return {
                    'color': config.Value,
                }
            },
        },
        methods: {
            makePrefixForTranslation (string) {
                const makeFirstLetterInLowerCase = (string) => string.charAt(0).toLowerCase() + string.slice(1)
                return this.$t(`layout.config.${makeFirstLetterInLowerCase(string)}`)
            }
        }
    }
</script>
<style lang="scss" scoped>
.color-picker ::v-deep {
    .el-color-picker__trigger {
        @apply w-24;
        border: none;

        .el-color-picker__color {
            border: none;
        }

        .el-icon-arrow-down:before,
        .el-icon-close:before {
            @apply text-sm;
            font-family: Montserrat, sans-serif;
            font-weight: 500;
            content: "Change";
            color: var(--primary-color);
        }

        .el-color-picker__color-inner {
            @apply rounded;
            background: transparent !important;
            border: 1px solid var(--primary-color);
            color: var(--gray-550);
        }

        &:hover {
            .el-icon-arrow-down:before,
            .el-icon-close:before {
                color: var(--primary-color);
            }

            .el-color-picker__color-inner {
                border: 1px solid var(--primary-color);
                color: var(--primary-color);
            }
        }
    }

    .el-color-dropdown__link-btn {
        padding: 0 !important;
    }
}
</style>
