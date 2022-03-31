<template>
    <default-button
        :icon="icon"
        :label="buttonLabel"
        :outline="outline"
        v-bind="$attrs"
        v-on="$listeners"
    />
</template>

<script>

export default {
    components: {
        DefaultButton: () => import("@/components/Common/Buttons/DefaultButton")
    },
    props: {
        icon: {
            type: String,
            default: 'IconDiscard'
        },
        label: {
            type: String,
            default: ''
        },
        outline: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        buttonLabel () {
            return this.label || this.$t('common.cancel')
        }
    }
}
</script>
