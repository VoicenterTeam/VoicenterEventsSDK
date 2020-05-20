<template>
    <el-tooltip :content="$t('tooltip.remove.group')" class="item" effect="dark" placement="top">
        <Trash2Icon @click="$emit('removeGroup', widgetGroup)"
                    class="flex align-center w-6 h-6 mx-1 text-red cursor-pointer">
        </Trash2Icon>
    </el-tooltip>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import {Trash2Icon} from 'vue-feather-icons'

    export default {
        name: "edit-group-buttons",
        components: {
            Trash2Icon,
            [Tooltip.name]: Tooltip
        },
        props: {
            widgetGroup: {
                type: Object,
                default: () => ({})
            }
        },
    }
</script>
