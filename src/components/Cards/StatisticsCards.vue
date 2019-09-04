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
            <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon"
                        @click="$emit('remove-item')"></trash-icon>
            <edit-icon class="flex align-center w-10 h-8 p-2 edit-icon text-primary"></edit-icon>
            <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"></more-vertical-icon>
            <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"></more-vertical-icon>
        </div>
        <div v-else>
            <edit-icon class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"
                       @click="()=>{this.showModal = true}"></edit-icon>
        </div>
    </div>
</template>
<script>
    import {TrashIcon, EditIcon, MoreVerticalIcon} from 'vue-feather-icons'

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
            EditIcon,
            MoreVerticalIcon
        }
    }
</script>
<style lang="scss" scoped>
    .trash-icon, .edit-icon {
        position: relative;
        top: -50px;
        right: -30px;
        cursor: pointer;
    }

    .edit-card-icon {
        position: relative;
        top: -50px;
        right: -20px;
        cursor: pointer;
    }

    .rtl .trash-icon,
    .rtl .edit-icon {
        left: -30px;
        right: auto;
    }

    .rtl .edit-card-icon {
        left: -20px;
        right: auto;
    }

    .editable-content {
        transition: all 0.3s ease-in-out 0s;
    }
</style>
