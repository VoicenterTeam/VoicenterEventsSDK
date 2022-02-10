<template>
    <base-button
        v-bind="$attrs"
        fixed-width="w-37"
        :type="type"
        v-on="listeners">
        <slot>
            <div class="flex items-center">
                <slot v-if="$slots.icon || icon"
                      name="icon">
                    <component v-if="icon"
                               :is="icon"
                               class="mx-1"/>
                </slot>
                <span class="mx-1">{{ label }}</span>
            </div>
        </slot>
    </base-button>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            default: 'IconConfirm'
        },
        label: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'default'
        }
    },
    computed: {
        listeners () {
            return {
                ...this.$listeners,
                click: this.onClick
            }
        }
    },
    methods: {
        onClick () {
            this.$emit('on-click')
        }
    }
}
</script>
