<template>
    <el-tooltip :open-delay="700" placement="top">
        <div slot="content">{{ description }}</div>
        <base-button v-on="$listeners"
                     square
                     link
                     :disabled="disabled"
                     class="inline-flex"
                     data-test-name="edit"
                     :icon="icon"
                     :icon-size="iconSize"
                     :type="type">
        </base-button>
    </el-tooltip>
</template>

<script>
import BaseButton from "@/components/Common/Buttons/BaseButton";

export default {
    name: 'edit-button-icon',
    components: {
        BaseButton
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            default: ''
        },
        icon: {
            required: true,
            type: String,
        },
        iconSize: {
            type: String,
            default: 'md'
        },
        type: {
            type: String,
            default: 'primary'
        }
    }
}
</script>
