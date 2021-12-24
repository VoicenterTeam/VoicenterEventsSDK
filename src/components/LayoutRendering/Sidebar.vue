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
            <div v-if="editMode && !showTabs"
                 class="px-14 text-gray-900 text-2xl">
                {{ $t('Edit Mode') }}
            </div>
        </div>
        <div class="flex items-center px-14 hidden md:flex">
            <div class="flex items-center" v-if="layoutType === 'tabbed'">
                <div @click="addNewGroup"
                     class="w-32 cursor-pointer text-sm text-gray-500 hover:text-primary flex justify-center items-center rounded border border-gray-550 hover:border-primary h-7">
                    <IconNewGroup class="mx-0-5"/>
                    <span class="mx-0-5">{{ $t('Add Group') }}</span>
                </div>
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

    export default {
        components: {
            ActionsTabbedView,
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
                this.$emit('exit-edit-mode')
            },
            onSubmit() {
                this.$emit('save-dashboard')
            },
            onEditWidgetGroup(group) {
                this.$emit('on-edit-widget-group', group)
            },
            onRemoveWidgetGroup(group) {
                this.$emit('on-remove-widget-group', group)
            },
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
