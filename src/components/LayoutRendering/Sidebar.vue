<template>
    <div class="flex sidebar-tabs__container justify-between w-full">
        <div class="w-full flex items-center overflow-x-auto">
            <template v-if="showTabs">
                <div
                    class="tab-wrapper px-3 lg:px-10 text-main-lg cursor-pointer"
                    v-for="(group, index) in widgetGroupList"
                    @click="switchTab(group)"
                    :key="index">
                    <div></div>
                    <div class="flex justify-between w-full items-center"
                        :key="`edit-${group.WidgetGroupID}`">
                        <div class="whitespace-no-wrap tab-name"
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
            <div v-show="editMode && !showTabs"
                 class="px-14 text-gray-900 text-2xl">
                {{ $t('Edit Mode') }}
            </div>
        </div>
        <div class="flex items-center px-14 hidden md:flex">
            <div class="flex items-center" v-if="layoutType === 'tabbed'">
                <create-new-widget-button
                    class="mr-5"
                    v-if="!editMode && widgetGroupList.length"
                    @click="clickToAddNewWidget"
                />
                <new-group-button
                    :disabled="editMode"
                    @click="addNewGroup"
                />
            </div>
            <template v-if="editMode">
                <IconVerticalLine class="mx-6 h-12"/>
                <el-button @click="onSubmit"
                           size="mini"
                           type="_primary"
                           class="h-7">
                    {{ $t('Save') }}
                </el-button>
                <div class="mx-6 font-medium cursor-pointer text-steel hover:text-primary"
                     @click="onCancel">
                    {{ $t('Cancel') }}
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import ActionsTabbedView from '@/components/LayoutRendering/ActionsTabbedView'
    import NewGroupButton from '@/components/NewGroupButton'
    import CreateNewWidgetButton from '@/components/CreateNewWidgetButton'
    import bus from '@/event-bus/EventBus';

    export default {
        components: {
            ActionsTabbedView,
            NewGroupButton,
            CreateNewWidgetButton
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
            onEditMode () {
                return this.$store.getters['widgetCreation/getQuickCreatingWidget']
            }
        },
        watch: {
            onEditMode: {
                handler (val) {
                    if (Object.values(val).every(el => el)) {
                        const group = this.widgetGroupList.filter(el => el.WidgetGroupID.toString() === this.activeTab.toString())
                        this.$emit('on-edit-widget-group', group)
                    }
                },
                deep: true
            }
        },
        methods: {
            widgetGroupName(group, index) {
                if (group.IsNew) {
                    return this.$t('Group') + ' ' + (index + 1)
                }
                return group.WidgetGroupTitle || this.$t('Group ID') + ': ' + group.WidgetGroupID
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
                bus.$emit('add-new-widget-by-navbar', true);
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
