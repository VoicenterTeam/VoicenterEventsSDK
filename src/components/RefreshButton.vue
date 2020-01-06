<template>
    <button class="btn p-2 shadow rounded bg-white hover:bg-primary-100 mx-1 border border-primary"
            v-bind="$attrs"
            v-on="$listeners">
        <RefreshCwIcon class="w-5 h-5 text-primary"/>
    </button>
</template>
<script>
    import {RefreshCwIcon} from 'vue-feather-icons'

    export default {
        inheritAttrs: false,
        components: {
            RefreshCwIcon,
        },
    }
</script>
<style>
    .btn {
        transition: all .2s;
    }

    .btn:focus {
        outline: none;
        @apply shadow-outline;
        @apply bg-blue-200;
    }

    .btn.active-btn {
        @apply bg-blue-200;
    }

    .btn:disabled {
        @apply cursor-not-allowed;
    }
</style>
