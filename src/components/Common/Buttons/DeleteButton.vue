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
import DefaultButton from "@/components/Common/Buttons/DefaultButton"

export default {
    components: {
        DefaultButton
    },
    props: {
        icon: {
            type: String,
            default: 'IconDelete'
        },
        label: {
            type: String,
            default: ''
        }
    },
    computed: {
        buttonLabel () {
            return this.label || this.$t('common.delete')
        }
    }
}
</script>
