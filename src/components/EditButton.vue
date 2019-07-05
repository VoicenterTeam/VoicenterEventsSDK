<template>
    <button class="btn p-4 shadow rounded bg-white hover:bg-blue-100 active:shadow-inner" v-bind="$attrs" v-on="$listeners">
        <slot>
            <EditIcon class="w-5 h-5 text-blue"></EditIcon>
        </slot>
    </button>
</template>
<script>
    import { EditIcon} from 'vue-feather-icons'
    export default {
        inheritAttrs: false,
        components:{EditIcon},
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
