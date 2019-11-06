<template>
    <div class="w-full bg-white px-6 py-4 my-4 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex items-center">
            <slot name="icon">
                <component class="min-w-16 mx-1 text-primary" :is="cardIcon"></component>
            </slot>
            <slot name="text">
                <h5 class="text-xl font-bold mx-3 status-text" v-if="showText" :style="textColor">
                    {{statusText}}
                </h5>
            </slot>
            <div :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
                <slot name="value">
                    <h5 class="text-6xl font-bold -mr-3" v-if="cardValue" :style="textColor">
                        {{cardValue}}
                    </h5>
                </slot>
            </div>
            <div class="flex editable-content" v-if="editable">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                    <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon"
                                @click="$emit('remove-item')"></trash-icon>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-icon class="flex align-center w-10 h-8 p-2 edit-icon text-primary"
                               @click="()=>{this.showModal = true}"></edit-icon>
                </el-tooltip>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"></more-vertical-icon>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"></more-vertical-icon>
            </div>
            <div v-else class="flex">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-icon class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"
                               @click="()=>{this.showModal = true}"></edit-icon>
                </el-tooltip>
            </div>
        </div>
        <extension-update-dialog
            :width="setWidth"
            :status="status"
            :showText="showText"
            :visible.sync="showModal"
            @on-change="changeStatus">
        </extension-update-dialog>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import statusTypes from '@/enum/statusTypes'
    import ExtensionUpdateDialog from './ExtensionUpdateDialog'
    import {TrashIcon, EditIcon, MoreVerticalIcon} from 'vue-feather-icons'

    export default {
        name: 'status-card',
        props: {
            status: {
                type: Number,
                default: 3
            },
            editable: {
                type: Boolean,
                default: true
            },
            showText: {
                type: Boolean,
                default: false
            }
        },
        components: {
            TrashIcon,
            EditIcon,
            MoreVerticalIcon,
            ExtensionUpdateDialog,
            [Tooltip.name]: Tooltip,
        },
        data() {
            return {
                showModal: false,
                statusMappings: statusTypes,
            }
        },
        computed: {
            extensions() {
                return this.$store.state.extensions.extensions
            },
            cardValue() {
                return this.extensions.filter(el => el.representativeStatus === this.status).length || '0'
            },
            cardIcon() {
                return this.statusMappings[this.status].icon
            },
            statusText() {
                return this.$t(this.statusMappings[this.status].text)
            },
            textColor() {
                let color = this.statusMappings[this.status].color
                return {
                    color: `${color}`
                }
            },
            isMobileOrTablet() {
                return this.$store.getters['utils/isMobileOrTablet']
            },
            setWidth() {
                if (this.isMobileOrTablet) {
                    return '80%'
                } else {
                    return '40%'
                }
            }
        },
        methods: {
            changeStatus(data = {}) {
                this.$emit('change-extension-status', data);
            }
        }
    }
</script>

<style lang="scss" scoped>

    .trash-icon, .edit-icon {
        position: relative;
        top: -40px;
        right: -30px;
        cursor: pointer;
    }

    .edit-card-icon {
        position: relative;
        top: -40px;
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

    .status-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .min-w-16 {
        min-width: 4rem;
    }
</style>
