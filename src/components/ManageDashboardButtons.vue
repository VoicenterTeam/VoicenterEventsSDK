<template>
        <div class="relative flex">
            <el-tooltip :content="$t('tooltip.set.edit.mode')" class="item" effect="dark"
                        placement="top">
                <button :class="{'active-btn': editMode}"
                        @click.stop="triggerMenu"
                        class="btn p-2 shadow rounded bg-white hover:bg-primary-100 mx-1"
                        v-bind="$attrs">
                    <EditIcon class="w-5 h-5 text-primary"></EditIcon>
                </button>
            </el-tooltip>
            <div class="origin-top-right absolute right-0 mt-4 w-64" v-click-outside="onClickOutside" v-if="showMenu">
                <div class="shadow-lg rounded-lg bg-white">
                    <div class="py-1">
                        <div class="px-3 py-2 text-center">{{$t('Select a widget group to edit')}}</div>
                        <div class="px-4" v-if="activeTabGroup">
                            <el-button
                                @click="onEditGroup(activeTabGroup)"
                                class="w-56 truncate"
                                type="default">{{`${$t('Current group')}: ${activeTabGroup.WidgetGroupTitle}`}}
                            </el-button>
                        </div>
                        <div v-for="widgetGroup in widgetGroupList">
                            <div :key="widgetGroup.WidgetGroupID"
                                 @click="onEditGroup(widgetGroup)"
                                 class="rounded m-2 cursor-pointer block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-primary-100 border-2 border-dotted">
                                {{widgetGroup.WidgetGroupTitle}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="editMode">
                <el-tooltip :content="$t('tooltip.update.dashboard')" class="item" effect="dark" placement="top">
                    <button @click="$emit('save-dashboard')"
                            class="btn p-2 shadow rounded bg-white hover:bg-green-100 mx-1"
                            v-bind="$attrs"
                            v-on="$listeners">
                        <CheckIcon class="w-5 h-5 text-green"></CheckIcon>
                    </button>
                </el-tooltip>
                <el-tooltip :content="$t('tooltip.reset.changes')" class="item" effect="dark" placement="top">
                    <button @click="$emit('reset-dashboard')"
                            class="btn p-2 shadow rounded bg-white hover:bg-red-100 mx-1"
                            v-bind="$attrs"
                            v-on="$listeners">
                        <XIcon class="w-5 h-5 text-red"></XIcon>
                    </button>
                </el-tooltip>
            </div>
        </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import {CheckIcon, EditIcon, XIcon} from 'vue-feather-icons'
    import {ACTIVE_WIDGET_GROUP_KEY, layoutTypes} from "@/enum/layout";

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
            },
            layoutType: {
                type: String,
                default: ''
            },
            widgetGroupList: {
                type: Array,
                default: () => ([])
            },
        },
        data () {
            return {
                showMenu: false,
                activeTab: ''
            }
        },
        computed: {
            activeTabGroup () {
                if (this.layoutType !== layoutTypes.TABBED) {
                    return null
                }
                return this.widgetGroupList.find((group) => group.WidgetGroupID === Number(this.activeTab))
            },
        },
        methods: {
            triggerMenu () {
                if (this.widgetGroupList.length < 2) {
                    let widgetGroup = this.widgetGroupList[0]
                    this.$emit('edit-group', widgetGroup)
                    return
                }

                this.activeTab = localStorage.getItem(ACTIVE_WIDGET_GROUP_KEY) || null;
                this.showMenu = !this.showMenu
            },
            onEditGroup (widgetGroup) {
                this.$emit('edit-group', widgetGroup)
                this.showMenu = false
            },
            onClickOutside () {
                this.showMenu = false
            },
        },
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
