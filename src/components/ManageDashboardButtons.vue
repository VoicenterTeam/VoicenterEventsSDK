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
        <div class="origin-top-right absolute right-0 mt-4 w-64 z-50" v-click-outside="onClickOutside" v-if="showMenu">
            <div class="shadow-lg rounded-lg bg-white">
                <div class="py-1">
                    <div class="px-3 py-2 text-center">{{$t('Select a widget group to edit')}}</div>
                    <div class="px-1 flex flex-row items-center">
                        <div class="flex w-1/2 mx-1" v-if="activeTabGroup">
                            <el-tooltip
                                :content="`${$t('dashboard.currentGroup')}: ${activeTabGroup.WidgetGroupTitle}`" class="item"
                                effect="dark"
                                placement="top">
                                <button
                                    class="w-full border btn items-center p-2 shadow rounded bg-white text-gray-700 cursor-pointer text-main-xs font-semibold hover:bg-primary-100 hover:text-primary"
                                    @click="onEditGroup(activeTabGroup)"
                                    :class="{'w-full': !activeTabGroup}">
                                    {{$t('dashboard.currentGroup')}}
                                </button>
                            </el-tooltip>
                        </div>
                        <div class="flex w-1/2 mx-1" :class="{'w-full': !activeTabGroup}">
                            <el-tooltip :content="$t('Click to add new group')" class="item" effect="dark"
                                        placement="top">
                                <button
                                    class="w-full justify-center border btn flex items-center p-2 shadow rounded bg-white text-gray-700 cursor-pointer hover:bg-primary-100 hover:text-primary"
                                    @click="addNewGroup()">
                                    <IconPlus class="w-2 fill-current mx-1"/>
                                    <span class="text-main-xs font-semibold">{{$t('common.newGroup')}}</span>
                                </button>
                            </el-tooltip>
                        </div>
                    </div>
                    <div v-for="widgetGroup in widgetGroupList">
                        <div :key="widgetGroup.WidgetGroupID"
                             @click="onEditGroup(widgetGroup)"
                             class="rounded m-2 cursor-pointer block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-primary-100 border-2 border-dotted">
                            {{widgetGroup.WidgetGroupTitle || $t('Group ID') +': '+ widgetGroup.WidgetGroupID}}
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
    import { Tooltip } from 'element-ui'
    import NewGroupButton from './NewGroupButton'
    import { CheckIcon, EditIcon, XIcon } from 'vue-feather-icons'
    import { ACTIVE_WIDGET_GROUP_KEY, layoutTypes } from '@/enum/layout'

    export default {
        inheritAttrs: false,
        components: {
            XIcon,
            EditIcon,
            CheckIcon,
            NewGroupButton,
            [Tooltip.name]: Tooltip,
        },
        props: {
            editMode: {
                type: Boolean,
                default: false,
            },
            layoutType: {
                type: String,
                default: '',
            },
            widgetGroupList: {
                type: Array,
                default: () => ([]),
            },
        },
        data() {
            return {
                showMenu: false,
                activeTab: '',
            }
        },
        computed: {
            activeTabGroup() {
                if (this.layoutType !== layoutTypes.TABBED) {
                    return null
                }
                return this.widgetGroupList.find((group) => group.WidgetGroupID === Number(this.activeTab))
            },
        },
        methods: {
            triggerMenu() {
                if (this.widgetGroupList.length < 2) {
                    let widgetGroup = this.widgetGroupList[0]
                    this.$emit('edit-group', widgetGroup)
                    return
                }

                this.activeTab = localStorage.getItem(ACTIVE_WIDGET_GROUP_KEY) || null
                this.showMenu = !this.showMenu
            },
            onEditGroup(widgetGroup) {
                this.$emit('edit-group', widgetGroup)
                this.showMenu = false
            },
            onClickOutside() {
                this.showMenu = false
            },
            addNewGroup() {
                this.$emit('add-new-group')
                this.showMenu = false
            },
        },
    }
</script>
<style scoped>
    .btn {
        transition: all .2s;
    }

    .btn:focus {
        outline: none;
        @apply ring;
        @apply bg-blue-200;
    }

    .btn.active-btn {
        @apply bg-blue-200;
    }
</style>
