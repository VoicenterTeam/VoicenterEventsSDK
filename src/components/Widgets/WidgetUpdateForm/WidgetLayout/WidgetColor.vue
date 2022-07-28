<template>
    <div class="flex items-center">
        <color-picker
            class="mx-2 mt-1-5"
            color-format="hex"
            v-model="value"
            :predefine="predefinedColors"/>
        <slot>
            <IconColorPicker class="w-6 h-6"
                             :style="getIndicatorStyles(value)"/>
        </slot>
        <span class="px-1 text-main-sm">
            {{ $t('widget.settings.color.' + option) }}
        </span>
    </div>
</template>

<script>

export default {
    components: {
        ColorPicker: () => import('@/components/Common/ColorPicker')
    },
    props: [
        'value',
        'option',
        'predefinedColors'
    ],
    watch: {
        value (newV) {
            this.$emit('input', newV)
        }
    },
    methods: {
        getIndicatorStyles(color) {
            return {
                'color': color,
            }
        },
    }
}
</script>
