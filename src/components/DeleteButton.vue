<template>
    <button v-bind="$attrs" v-on="$listeners"
            class="btn p-2 shadow rounded bg-white hover:bg-red-200 active:shadow-inner border border-red-300">
        <trash2-icon class="flex align-center w-5 h-5 text-red trash-icon"/>
    </button>
</template>
<script>
    import {Trash2Icon} from 'vue-feather-icons'

    export default {
        name: 'delete-button',
        inheritAttrs: false,
        components: {
            Trash2Icon
        }
    }
</script>
