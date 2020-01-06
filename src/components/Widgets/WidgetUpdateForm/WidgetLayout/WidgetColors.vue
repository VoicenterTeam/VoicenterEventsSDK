<template>
    <div class="pt-2">
        <label class="text-sm">{{$t('Widget colors')}}</label>
        <div class="flex pt-4">
            <div class="flex" v-for="option of getWidgetColors">
                <color-picker
                    v-model="model.colors[option]"
                    :predefine="predefinedColors"/>
                <span class="p-2">{{$t('widget.settings.color.'+option)}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import uniq from 'lodash/uniq'
    import values from 'lodash/values'
    import ColorPicker from '@/components/Common/ColorPicker'
    import {widgetColors} from '@/enum/layout'

    const BACKGROUND_COLOR_KEY = ["background"];

    export default {
        components: {
            ColorPicker
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
            onlyBackground: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            predefinedColors() {
                let options = values(this.$store.getters['dashboards/baseColors'])
                return uniq(options)
            },
            getWidgetColors() {
                if (this.onlyBackground) {
                    return BACKGROUND_COLOR_KEY
                }
                return widgetColors
            }
        }
    }
</script>
