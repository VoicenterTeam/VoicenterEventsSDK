<template>
    <div v-if="model.ParameterType">
        <div class="flex justify-between w-full">
            <div class="flex items-center">
                <label>
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
                        <IconInfo/>
                    </span>
                </el-tooltip>
            </div>
        </div>
        <component :is="getComponent.name"
                   :type="getComponent.type"
                   v-model="model.WidgetParameterValue"
                   :placeholder="$t('settings.add.filter')"
                   v-bind="getComponent.params">
        </component>
    </div>
</template>
<script>
    import {componentTypes} from '@/enum/widgetTemplateConfigs'
    import Input from './Types/Input'

    export default {
        components: {
            Input,
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
            }
        }
    }
</script>
