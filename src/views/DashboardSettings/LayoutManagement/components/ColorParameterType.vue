<template>
    <div class="grid grid-cols-2 gap-20 w-full py-2 items-center color-picker">
        <div class="col-span-1"
             v-if="displayLabel">
            <span class="text-main-sm">
                {{ $t(LayoutParameterName) }}:
            </span>
        </div>
        <div class="flex items-center"
             :class="displayLabel ? 'col-span-1 justify-center': 'col-span-2'">
            <slot>
                <IconColorPicker class="w-8 h-8"
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
            font-family: Montserrat;
            font-weight: 600;
            content: "Change";
            color: var(--gray-550);
        }
        
        .el-color-picker__color-inner {
            @apply rounded;
            background: transparent !important;
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
