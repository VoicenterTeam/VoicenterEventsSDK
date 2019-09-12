<template>
    <div v-if="!editMode">
        <el-tooltip class="item" effect="dark" :content="$t('tooltip.set.edit.mode')"
                    placement="top">
            <button class="btn p-2 shadow rounded bg-white hover:bg-primary-100 mx-1"
                    :class="{'active-btn': editMode}"
                    v-bind="$attrs"
                    v-on="$listeners">
                <EditIcon class="w-5 h-5 text-primary"></EditIcon>
            </button>
        </el-tooltip>
    </div>
    <div v-else class="flex">
        <el-tooltip class="item" effect="dark" :content="$t('tooltip.update.dashboard')" placement="top">
            <button class="btn p-2 shadow rounded bg-white hover:bg-green-100 mx-1"
                    @click="$emit('save-dashboard')"
                    v-bind="$attrs"
                    v-on="$listeners">
                <CheckIcon class="w-5 h-5 text-green"></CheckIcon>
            </button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('tooltip.reset.changes')" placement="top">
            <button class="btn p-2 shadow rounded bg-white hover:bg-red-100 mx-1"
                    @click="$emit('reset-dashboard')"
                    v-bind="$attrs"
                    v-on="$listeners">
                <XIcon class="w-5 h-5 text-red"></XIcon>
            </button>
        </el-tooltip>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import {EditIcon, CheckIcon, XIcon} from 'vue-feather-icons'

    export default {
        inheritAttrs: false,
        components: {
            XIcon,
            EditIcon,
            CheckIcon,
            [Tooltip.name]: Tooltip
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
