<template>
    <div>
        <label>
            {{data.ParameterPrettyName}}
        </label>
        <component :is="getComponent.name"
                   :placeholder="$t('settings.add.filter')"
                   v-model="data.WidgetParameterValue">
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
            data: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            getComponent() {
                return componentTypes[this.data.ParameterType]
            }
        }
    }
</script>
