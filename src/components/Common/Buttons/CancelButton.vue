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
        },
        outline: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        buttonLabel () {
            return this.label || this.$t('Cancel')
        }
    }
}
</script>
