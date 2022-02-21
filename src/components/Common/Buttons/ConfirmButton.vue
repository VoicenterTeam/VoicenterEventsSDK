<template>
    <default-button
        :icon="icon"
        :label="buttonLabel"
        type="primary"
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
            default: 'IconConfirm'
        },
        label: {
            type: String,
            default: ''
        }
    },
    computed: {
        buttonLabel () {
            return this.label || this.$t('Confirm')
        }
    }
}
</script>
