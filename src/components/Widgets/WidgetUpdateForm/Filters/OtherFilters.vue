<template>
    <div v-if="this.model.ParameterType">
        <label>
            {{model.ParameterPrettyName}}
        </label>
        {{ model }}
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
            }
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
