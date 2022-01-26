<template>
    <div class="flex items-center rounded-4xl bg-gray-150 mx-2 py-0-5 px-3 text-sm leading-5 font-normal">
        <span>
            {{ recipient }}
        </span>
        <el-tooltip :content="$t('widget.deleteRecipient')"
                    placement="top">
            <div role="button"
                 :class="$rtl.isRTL ? 'mr-2 ml-auto': 'ml-2 mr-auto'"
                 class="text-gray-950 hover:text-red">
                <IconClose class="w-3 h-3"/>
            </div>
        </el-tooltip>
    </div>
</template>
<script>
    export default {
        props: {
            recipient: {
                type: String,
                default: '',
            },
        },
        canDelete: {
            type: Boolean,
            default: true,
        },
    }
</script>
