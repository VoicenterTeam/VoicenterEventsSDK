<template>
    <div class="flex sidebar-tabs__container justify-between w-full">
        <div class="w-full flex items-center overflow-x-auto" id="sidebar-line">
            <template v-if="showTabs">
                <div
                    class="tab-wrapper cursor-pointer"
                    v-for="(group, index) in widgetGroupList"
                    @click="switchTab(group)"
                    :key="index"
                    :style="getStyles"
                >
                    <div></div>
                    <div class="flex justify-between w-full items-center"
                        :key="`edit-${group.WidgetGroupID}`">
                        <div class="whitespace-nowrap tab-name"
                            :class="[{'active': isActiveGroup(group)}, $rtl.isRTL ? 'ml-4' : 'mr-4']">
                            {{ widgetGroupName(group, index) }}
                        </div>
                        <ActionsTabbedView :edit-mode="editMode"
                                        @on-remove-widget-group="onRemoveWidgetGroup(group)"
                                        @on-edit-widget-group="onEditWidgetGroup(group)"
                                        :key="`group-${group.WidgetGroupID}`"
                                        :is-active-group="isActiveGroup(group)"
                        />
                    </div>
                    <fade-transition mode="out-in" :duration="250">
                        <div v-if="isActiveGroup(group)"
                            class="self-border"/>
                        <div v-else/>
                    </fade-transition>
                </div>
            </template>
            <div v-if="editMode && !showTabs"
                 class="px-14 text-gray-900 text-2xl">
                {{ $t('general.editMode') }}
            </div>
        </div>
        <div class="flex items-center px-14 hidden md:flex">
            <div class="flex items-center" v-if="layoutType === 'tabbed'">
                <create-new-widget-button
                    :class="$rtl.isRTL? 'ml-5':'mr-5'"
                    v-show="!editMode && widgetGroupList.length"
                    @click="clickToAddNewWidget"
                />
                <new-group-button
                    v-if="!editMode"
                    @click="addNewGroup"
                />
            </div>
            <template v-if="editMode">
                <IconVerticalLine class="mx-6 h-12"/>
                <confirm-button
                    :label="$t('common.save')"
                    icon="IconSave"
                    size="sml"
                    @on-click="onSubmit"
                />
                <cancel-button
                    link
                    :outline="false"
                    size="sml"
                    @on-click="onCancel"
                />
            </template>
        </div>
    </div>
</template>
<script>
    export default {
        components: {
            ActionsTabbedView: () => import('@/components/LayoutRendering/ActionsTabbedView'),
            NewGroupButton: () => import('@/components/NewGroupButton'),
            CreateNewWidgetButton: () => import('@/components/CreateNewWidgetButton'),
            CancelButton: () => import("@/components/Common/Buttons/CancelButton"),
            ConfirmButton: () => import("@/components/Common/Buttons/ConfirmButton")
        },
        props: {
            widgetGroupList: {
                type: Array,
                default: () => ([]),
            },
            activeTab: {
                type: [String, Number],
                default: '',
            },
            showTabs: {
                type: Boolean,
                default: true,
            },
            editMode: {
                type: Boolean,
                default: false,
            },
            onFullScreen: {},
            layoutType: {
                type: String,
                default: 'tabbed'
            }
        },
        computed: {
            getTypeOfLayout () {
                return this.$store.getters['layout/getTypeOfLayout']
            },
            getStyles () {
                return this.$store.getters['layout/widgetGroupTitleStyles'](this.getTypeOfLayout)
            }
        },
        methods: {
            widgetGroupName(group, index) {
                if (group.IsNew) {
                    return this.$t('general.group') + ' ' + (index + 1)
                }
                return group.WidgetGroupTitle || this.$t('dashboard.groupID') + ': ' + group.WidgetGroupID
            },
            switchTab(group) {
                if (this.editMode) {
                    this.onEditWidgetGroup(group)
                }
                this.$emit('switch-tab', group.WidgetGroupID.toString())
            },
            isActiveGroup(group) {
                return group.WidgetGroupID.toString() === this.activeTab.toString()
            },
            addNewGroup() {
                this.$emit('add-new-group')
            },
            onCancel() {
                this.$store.dispatch('widgetCreation/resetQuickCreatingWidget')
                this.$emit('exit-edit-mode')
            },
            onSubmit() {
                this.$store.dispatch('widgetCreation/resetQuickCreatingWidget')
                this.$emit('save-dashboard')
            },
            onEditWidgetGroup(group) {
                this.$emit('on-edit-widget-group', group)
            },
            onRemoveWidgetGroup(group) {
                this.$emit('on-remove-widget-group', group)
            },
            clickToAddNewWidget () {
                this.onEditWidgetGroup(this.activeTab)
                const data = {
                    key: 'isClickedOnAddBtn',
                    value: true
                }
                this.$store.dispatch('widgetCreation/updateQuickCreatingWidget', data)
            }
        },
    }
</script>
<style scoped lang="scss">
.active {
    margin-bottom: -0.25rem;
}
.rtl .sidebar-tabs__container>div {
    @apply mr-4;
}

.sidebar-tabs__container {
    @apply bg-white h-16 w-full flex;
    box-shadow: 0 0 1px 0 var(--silver-two), 0 1px 4px 0 var(--silver-two);
}

.tab-wrapper {
    @apply flex justify-between flex-col;
    line-height: normal;
    color: var(--steel);
    height: 100%;

    .active {
        color: var(--greyish-brown);
    }

    &:first-child {
        margin-left: 65px;
    }
    &:not(:first-child) {
        margin-left: 40px;
    }
}

.self-border {
    @apply rounded-t bg-primary;
    height: 0.25rem;
    width: 120%;
    margin-left: -10%;
}

.rtl {
    .self-border {
        margin-right: -10%;
    }
}
</style>
