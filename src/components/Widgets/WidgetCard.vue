<template>
    <div class="bg-white px-6 py-4 my-4 flex items-center justify-between rounded-lg shadow">
        <div class="flex items-center">
            <slot name="icon">
                <component class="w-16 mx-1 text-primary" :is="icon"></component>
            </slot>
            <slot name="title">
                <h5 class="text-3xl font-bold mx-3" v-if="caption">
                    {{caption}}
                </h5>
            </slot>
            <slot name="description">
                <p class="text-gray-500 text-lg mx-1" v-if="description">{{$t(description)}}</p>
            </slot>

        </div>
        <div class="flex editable-content" v-if="editable">
            <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon bg-red-100"
                        @click="$emit('remove-item')"></trash-icon>
            <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"></more-vertical-icon>
            <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"></more-vertical-icon>
        </div>
    </div>
</template>
<script>
    import {TrashIcon, MoreVerticalIcon} from 'vue-feather-icons'
    //TODO: define card object structure(fields)
    export default {
        props: {
            icon: String,
            caption: {
                type: [String, Number],
                default: '- -'
            },
            description: {
                type: [String],
                default: ''
            },
            editable: {
                type: Boolean,
                default: false
            }
        },
        components: {
            TrashIcon,
            MoreVerticalIcon
        }
    }
</script>
<style lang="scss" scoped>

    .trash-icon {
        position: relative;
        top: -45px;
        right: -50px;
        border-radius: 50%;
        cursor: pointer;
    }

    .rtl .trash-icon {
        left: -50px;
        right: auto;
    }

    .editable-content {
        transition: all 0.3s ease-in-out 0s;
    }
</style>
