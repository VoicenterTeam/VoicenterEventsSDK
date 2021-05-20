<template>
    <el-tooltip class="item" effect="dark" :content="$t(tooltipText)" placement="top">
        <button class="btn p-2 shadow rounded bg-white hover:bg-primary-100 mx-1 border border-primary"
                v-bind="$attrs"
                v-on="$listeners">
            <RefreshCwIcon class="w-3 h-3 text-primary" :class="{'loading': loading}"/>
        </button>
    </el-tooltip>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import {RefreshCwIcon} from 'vue-feather-icons'

    export default {
        inheritAttrs: false,
        props: {
            loading: Boolean,
            default: false,
            tooltipText: {
                type: String,
                default: 'refresh.filter.data'
            }
        },
        components: {
            RefreshCwIcon,
            [Tooltip.name]: Tooltip
        },
    }
</script>
<style>
    .btn {
        transition: all .2s;
    }

    .btn:focus {
        outline: none;
        @apply ring;
        @apply bg-blue-200;
    }

    .btn.active-btn {
        @apply bg-blue-200;
    }

    .btn:disabled {
        @apply cursor-not-allowed;
    }

    .loading {
        -webkit-animation: rotation 2s infinite linear;
    }

    @-webkit-keyframes rotation {
        from {
            -webkit-transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(359deg);
        }
    }
</style>
