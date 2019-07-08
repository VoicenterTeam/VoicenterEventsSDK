<template>
    <button v-if="!editMode" class="btn p-4 shadow rounded bg-white hover:bg-blue-100 active:shadow-inner"
            :class="{'active-btn': editMode}"
            v-bind="$attrs"
            v-on="$listeners">
        <EditIcon class="w-5 h-5 text-blue"></EditIcon>
    </button>
    <div v-else>
        <button class="btn p-4 shadow rounded bg-white hover:bg-green-100 active:shadow-inner mr-3"
                @click="$emit('save-dashboard')"
                v-bind="$attrs"
                v-on="$listeners">
            <CheckIcon class="w-5 h-5 text-green"></CheckIcon>
        </button>
        <button class="btn p-4 shadow rounded bg-white hover:bg-red-100 active:shadow-inner"
                @click="$emit('reset-dashboard')"
                v-bind="$attrs"
                v-on="$listeners">
            <TrashIcon class="w-5 h-5 text-red"></TrashIcon>
        </button>
    </div>
</template>
<script>
    import { EditIcon, CheckIcon, TrashIcon } from 'vue-feather-icons'
    export default {
        inheritAttrs: false,
        components:{
            EditIcon,
            CheckIcon,
            TrashIcon
        },
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
