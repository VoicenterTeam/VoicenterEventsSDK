<template>
    <div class="w-full bg-white px-6 py-4 my-4 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex items-center justify-between">
            <slot name="title">
                <h5 class="text-6xl font-bold mx-3" v-if="cardValue" :style="textColor">
                    {{cardValue}}
                </h5>
            </slot>
            <slot name="icon">
                <component class="w-16 mx-1 text-primary" :is="cardIcon"></component>
            </slot>
        </div>
        <div class="flex editable-content" v-if="editable">
            <edit-3-icon class="flex align-center w-8 h-8 p-2 text-blue edit-icon bg-blue-100"
                         @click="()=>{this.showModal = true}"></edit-3-icon>
            <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon bg-red-100"
                        @click="$emit('remove-item')"></trash-icon>
            <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"></more-vertical-icon>
            <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"></more-vertical-icon>
        </div>
        <extension-update-dialog
                width="30%"
                :status="status"
                :visible.sync="showModal"
                @on-change="changeStatus" >
        </extension-update-dialog>
    </div>
</template>
<script>
    import {TrashIcon, Edit3Icon ,MoreVerticalIcon} from 'vue-feather-icons'
    import ExtensionUpdateDialog from './ExtensionUpdateDialog'
    import statusTypes from '@/enum/statusTypes'
    export default {
        name: 'status-card',
        props: {
            status: {
                type:  Number,
                default: 3
            },
            editable: {
                type: Boolean,
                default: true
            }
        },
        components: {
            TrashIcon,
            Edit3Icon,
            MoreVerticalIcon,
            ExtensionUpdateDialog
        },
        data(){
            return {
                showModal: false,
                statusMappings: statusTypes,
            }
        },
        computed:{
            extensions(){
                return this.$store.state.extensions.extensions
            },
            cardValue(){
                return this.extensions.filter(el =>  el.representativeStatus === this.status).length || '- -'
            },
            cardIcon() {
                return this.statusMappings[this.status].icon
            },
            textColor() {
                let color =  this.statusMappings[this.status].color
                return {
                    color: `${color}`
                }
            }
        },
        methods:{
            changeStatus(newStatus){
                this.$emit('change-extension-status', newStatus);
            }
        }
    }
</script>
<style lang="scss" scoped>

    .trash-icon, .edit-icon {
        position: relative;
        top: -60px;
        right: -50px;
        border-radius: 50%;
        cursor: pointer;
        margin: 3px;
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
