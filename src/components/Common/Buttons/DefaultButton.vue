<template>
    <base-button
        v-bind="$attrs"
        fixed-width="w-37"
        :variant="variant"
        v-on="listeners">
        <slot>
            <div class="flex items-center">
                <component v-if="icon"
                           :is="icon"
                           class="mx-1"/>
                <span class="mx-1 text-base font-bold">{{ label }}</span>
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
        variant: {
            type: String,
            default: 'primary'
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
