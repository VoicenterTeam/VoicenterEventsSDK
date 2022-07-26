<template>
    <default-button
        :icon="icon"
        :label="buttonLabel"
        type="primary"
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
            default: 'IconConfirm'
        }
    },
    computed: {
        buttonLabel () {
            return this.$t('general.saveChanges')
        }
    }
}
</script>
