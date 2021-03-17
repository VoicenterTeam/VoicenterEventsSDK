<template>
    <div v-if="!editMode && isActiveGroup"
         class="mt-1 hover:text-primary cursor-pointer"
         @click.stop="triggerActionMenu"
         :class="{'text-primary': showMenuActions}">
        <IconOptions class="w-4 h-4 text-gray-500"/>
        <fade-transition :duration="350">
            <div v-if="showMenuActions"
                 v-click-outside="onMenuClickOutside"
                 class="sidebar-group_actions absolute w-56 bg-white z-50 mt-4 shadow-base rounded"
                 :class="$rtl.isRTL ? '-mr-28' : '-ml-28'"
            >
                <div class="menu-action_item"
                     @click="onEditWidgetGroup()">
                    <IconPencil class="text-green w-4-5 h-4-5"/>
                    <span class="mx-2 text-main-sm truncate">
                        {{ $t('Edit Group') }}
                    </span>
                </div>
                <div class="menu-action_item border-t border-gray-300"
                     @click="tryDeleteWidgetGroup()">
                    <IconDelete class="text-red w-4-5 h-4-5"/>
                    <span class="mx-2 text-main-sm truncate">
                        {{ $t('Delete Group') }}
                    </span>
                </div>
            </div>
        </fade-transition>
    </div>
</template>
<script>
    export default {
        props: {
            editMode: {
                type: Boolean,
                default: false,
            },
            group: {
                type: Object,
                default: () => ({}),
            },
            isActiveGroup: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                showMenuActions: false,
            }
        },
        methods: {
            tryDeleteWidgetGroup() {
                this.$emit('on-remove-widget-group')
                this.onMenuClickOutside()
            },
            triggerActionMenu() {
                this.showMenuActions = !this.showMenuActions
            },
            onEditWidgetGroup() {
                this.$emit('on-edit-widget-group')
                this.$nextTick(() => {
                    this.showMenuActions = false
                })
            },
            onMenuClickOutside() {
                this.showMenuActions = false
            },
        },
    }
</script>
<style lang="scss" scoped>
.sidebar-group_actions {
    .menu-action_item {
        @apply w-full rounded text-gray-700 flex items-center p-3;
        
        &:hover {
            color: var(--primary-color);
        }
    }
}
</style>
