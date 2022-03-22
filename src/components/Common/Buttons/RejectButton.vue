<template>
    <default-button
        :icon="icon"
        :label="buttonLabel"
        type="danger"
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
        }
    },
    computed: {
        buttonLabel () {
            return this.label || this.$t('Reject')
        }
    }
}
</script>
