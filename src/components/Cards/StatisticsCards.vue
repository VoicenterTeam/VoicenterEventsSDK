<template>
    <div class="max-w-lg bg-white px-6 py-4 my-4 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex flex-col items-center">
            <slot name="title">
                <h5 class="text-2xl font-bold mx-3" v-if="caption">
                    {{caption}}
                </h5>
            </slot>
            <slot name="content">
                <h2 class="text-6xl font-bold mx-3 text-green" v-if="cardValue">
                    0
                </h2>
            </slot>
        </div>
        <div class="flex editable-content" v-if="editable">
            <edit-3-icon class="flex align-center w-8 h-8 p-2 text-blue edit-icon bg-blue-100"
                         @click="$emit('remove-item')"></edit-3-icon>
            <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon bg-red-100"
                        @click="$emit('remove-item')"></trash-icon>
            <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"></more-vertical-icon>
            <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"></more-vertical-icon>
        </div>
    </div>
</template>
<script>
    import {TrashIcon, Edit3Icon, MoreVerticalIcon} from 'vue-feather-icons'
    export default {
        name: 'statistics-cards',
        props: {
            caption: {
                type: [String, Number],
                default: '- -'
            },
            cardValue: {
                type: [String, Number],
                default: '- -'
            },
            editable: {
                type: Boolean,
                default: true
            }
        },
        components: {
            TrashIcon,
            Edit3Icon,
            MoreVerticalIcon
        }
    }
</script>
<style lang="scss" scoped>

    .trash-icon, .edit-icon {
        position: relative;
        top: -75px;
        right: -50px;
        border-radius: 50%;
        cursor: pointer;
    }

    .rtl .trash-icon,
    .rtl .edit-icon {
        left: -50px;
        right: auto;
    }

    .editable-content {
        transition: all 0.3s ease-in-out 0s;
    }
</style>
