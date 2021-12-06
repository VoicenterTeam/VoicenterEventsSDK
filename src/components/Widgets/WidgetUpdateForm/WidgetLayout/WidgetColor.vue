<template>
    <div class="flex items-center">
        <slot>
            <IconColorPicker class="w-6 h-6"
                             :style="getIndicatorStyles(color)"/>
        </slot>
        <span class="px-1 text-main-sm">
            {{ $t('widget.settings.color.' + option) }}
        </span>
        <color-picker
            class="mx-2 mt-1-5"
            show-alpha
            v-model="color"
            :predefine="predefinedColors"/>
    </div>
</template>

<script>
import ColorPicker from '@/components/Common/ColorPicker'

export default {
    components: {
        ColorPicker
    },
    props: [
        'color',
        'option',
        'predefinedColors'
    ],
    methods: {
        getIndicatorStyles(color) {
            return {
                'color': color,
            }
        },
    }
}
</script>
