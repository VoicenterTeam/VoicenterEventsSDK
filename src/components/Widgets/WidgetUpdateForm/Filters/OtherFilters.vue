<template>
    <div v-if="this.model.ParameterType">
        <label>
            {{model.ParameterPrettyName}}
        </label>
        {{ model }}
        <component :is="getComponent.name"
                   :type="getComponent.type"
                   :placeholder="$t('settings.add.filter')"
                   v-model="model.WidgetParameterValue">
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
                return componentTypes[this.model.ParameterType]
            }
        }
    }
</script>
