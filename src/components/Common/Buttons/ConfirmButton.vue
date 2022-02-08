<template>
    <default-button
        :icon="icon"
        :label="buttonLabel"
        type="primary"
        v-on="$listeners"
    />
</template>

<script>
import DefaultButton from "@/components/Common/Buttons/DefaultButton"

export default {
    components: {
        DefaultButton
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
