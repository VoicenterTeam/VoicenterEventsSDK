<template>
    <div class="relative cursor-pointer">
        <i class="vc-icon-menu icon-lg text-gray-500 px-2 py-1-5 rounded hover:bg-primary-100"
           :class="{'bg-primary-100': showActionsMenu}"
           @click.stop="triggerMenu"/>
        <fade-transition :duration="350">
            <div v-click-outside="onMenuClickOutside"
                 class="menu-wrapper px-3 py-1 absolute right-0 z-50 h-auto mt-3"
                 v-if="showActionsMenu"
            >
                <div class="menu-action_item"
                     @click="onShowUpdateDialog()">
                    <IconPencil class="text-green w-4 h-4"/>
                    <span class="mx-2 truncate">{{ $t('tooltip.edit.widget') }}</span>
                </div>
                <template v-if="editable">
                    <div @click="onDuplicateWidget()"
                         class="menu-action_item border-t border-gray-300">
                        <IconDuplicate class="text-blue-600 w-4 h-4"/>
                        <span class="mx-2 truncate">{{ $t('widget.duplicateWidget') }}</span>
                    </div>
                    <div class="menu-action_item border-t border-gray-300"
                         @click="onRemoveWidget()">
                        <IconDelete class="text-red w-4 h-4"/>
                        <span class="mx-2 truncate">{{ $t('tooltip.remove.widget') }}</span>
                    </div>
                </template>
            </div>
        </fade-transition>
    </div>
</template>
<script>
    import { Tooltip } from 'element-ui'
    import { EditIcon, TrashIcon } from 'vue-feather-icons'
    
    export default {
        components: {
            EditIcon,
            TrashIcon,
            [Tooltip.name]: Tooltip,
        },
        props: {
            editable: {
                type: Boolean,
                default: false,
            },
            mainColor: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                showActionsMenu: false,
            }
        },
        methods: {
            triggerMenu() {
                this.showActionsMenu = !this.showActionsMenu
            },
            onMenuClickOutside() {
                this.showActionsMenu = false
            },
            onShowUpdateDialog() {
                this.emitter('show-modal')
            },
            onDuplicateWidget() {
                this.emitter('duplicate-widget')
            },
            onRemoveWidget() {
                this.emitter('remove-item')
            },
            emitter(event) {
                this.$emit(event)
            },
        },
    }
</script>
<style lang="scss" scoped>
.menu-wrapper {
    @apply rounded z-50 bg-white w-48 flex flex-col origin-top-right overflow-auto;
    box-shadow: 0 0 5px var(--gray-350);
}

.menu-action_item {
    @apply w-full rounded text-gray-700 flex items-center px-2 py-2 overflow-auto;
    &:hover {
        color: var(--primary-color);
    }
}
</style>
