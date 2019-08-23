<template>
    <button v-if="!editMode" class="btn p-2 shadow rounded bg-white hover:bg-blue-100 active:shadow-inner mx-1"
            :class="{'active-btn': editMode}"
            v-bind="$attrs"
            v-on="$listeners">
        <EditIcon class="w-5 h-5 text-primary"></EditIcon>
    </button>
    <div v-else>
        <button class="btn p-2 shadow rounded bg-white hover:bg-green-100 active:shadow-inner mx-1"
                @click="$emit('save-dashboard')"
                v-bind="$attrs"
                v-on="$listeners">
            <CheckIcon class="w-5 h-5 text-green"></CheckIcon>
        </button>
        <button class="btn p-2 shadow rounded bg-white hover:bg-red-100 active:shadow-inner mx-1"
                @click="$emit('reset-dashboard')"
                v-bind="$attrs"
                v-on="$listeners">
            <XIcon class="w-5 h-5 text-red"></XIcon>
        </button>
    </div>
</template>
<script>
    import {EditIcon, CheckIcon, XIcon} from 'vue-feather-icons'

    export default {
        inheritAttrs: false,
        components: {
            XIcon,
            EditIcon,
            CheckIcon
        },
        props: {
            editMode: {
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

    .btn.active-btn {
        @apply bg-blue-200;
    }
</style>
