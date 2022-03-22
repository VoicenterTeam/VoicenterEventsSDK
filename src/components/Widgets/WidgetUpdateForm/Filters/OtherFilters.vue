<template>
    <div v-if="model.ParameterType">
        <div class="flex justify-between w-full">
            <div class="flex items-center">
                <label class="text-gray-950 mb-2">
                    {{ model.ParameterPrettyName }}
                </label>
            </div>
            <div
                v-if="model.ParameterDescription"
                class="h-12 flex items-center category-wrapper hover:text-primary cursor-pointer"
            >
                <el-tooltip
                    :content="model.ParameterDescription"
                    :open-delay="200"
                    placement="top">
                    <span class="mx-2 truncate">
                        <i class="vc-icon-info cursor-help text-primary text-2xl"></i>
                    </span>
                </el-tooltip>
            </div>
        </div>
        <component
            class="input-number"
            :is="componentName"
            :type="getComponent.type"
            v-model="model.WidgetParameterValue"
            :placeholder="$t('settings.add.filter')"
            v-bind="getComponent.params">
        </component>
    </div>
</template>
<script>
    import {componentTypes} from '@/enum/widgetTemplateConfigs'
    import { InputNumber } from 'element-ui'

    export default {
        components: {
            Input: () => import('./Types/Input'),
            InputNumber
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            getComponent() {
                return {
                    params: {},
                    ...componentTypes[this.model.ParameterType]
                }
            },
            componentName () {
                return this.getComponent.name === 'Input' && this.getComponent.type === 'number' ? InputNumber : this.getComponent.name
            }
        }
    }
</script>

<style lang="scss" scoped>

::v-deep div.el-input-number {
    .el-input-number__decrease:hover,
    .el-input-number__increase:hover {
        color: var(--primary-color);

        ~ .el-input .el-input__inner {
            border-color: var(--primary-color);
        }
    }
}
.input-number {
    @apply h-7.5;
    ::v-deep .el-input-number__decrease, ::v-deep .el-input-number__increase {
        @apply h-8 top-3px;
    }
    ::v-deep .el-input-number__decrease i, ::v-deep .el-input-number__increase i {
        @apply h-full flex justify-center items-center font-bold;
    }
    ::v-deep .el-input input {
        @apply h-7.5;
    }
}
::v-deep .el-input-number--mini .el-input-number__decrease [class*=el-icon], ::v-deep .el-input-number--mini .el-input-number__increase [class*=el-icon] {
    -webkit-transform: scale(1);
    transform: scale(1);
}
</style>
