<template>
    <button class="btn p-4 shadow rounded bg-white hover:bg-blue-100 active:shadow-inner"
            :class="{'active-btn': editMode}"
            v-bind="$attrs"
            v-on="$listeners">
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
        props:{
            editMode:{
                type: Boolean,
                default: false
            }
        }
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
    .btn.active-btn{
        @apply bg-blue-200;
    }
</style>
