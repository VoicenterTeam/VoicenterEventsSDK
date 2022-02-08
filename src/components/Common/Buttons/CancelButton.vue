<template>
    <default-button
        :icon="icon"
        :label="buttonLabel"
        outline
        v-bind="$attrs"
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
            default: 'IconDiscard'
        },
        label: {
            type: String,
            default: ''
        }
    },
    computed: {
        buttonLabel () {
            return this.label || this.$t('Cancel')
        }
    }
}
</script>
