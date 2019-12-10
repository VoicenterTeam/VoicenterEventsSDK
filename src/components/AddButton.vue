<template>
    <el-tooltip class="item" effect="dark" :content="$t('tooltip.add.widgets')" placement="top">
        <button class="btn p-3 shadow rounded bg-white hover:bg-primary-100 hover:text-primary" v-bind="$attrs"
                v-on="$listeners">
            <slot>
                <IconPlus class="w-3 h-3 text-primary"/>
            </slot>
        </button>
    </el-tooltip>
</template>
<script>
    import {Tooltip} from 'element-ui'

    export default {
        components: {
            [Tooltip.name]: Tooltip
        },
        inheritAttrs: false
    }
</script>
<style>
    .btn {
        transition: all .2s;
    }

    .btn:focus {
        outline: none;
        @apply shadow-outline;
    }
</style>
