<template>
    <div class="" v-click-outside="onMenuClickOutside">
        <el-popover
            trigger="manual"
            v-model="showActionsMenu"
            :popper-options="
                { 
                    boundariesElement: 'body'
                }
            "
            :visible-arrow="false"
            :placement="$rtl.isRTL ? 'bottom-start' : 'bottom-end'"
        >
            <IconOptions
                class="w-4 h-4 text-primary dots-icon cursor-pointer"
                slot="reference"
                @click="triggerMenu"
            />
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
        </el-popover>
    </div>
</template>
<script>
    import { Tooltip, Popover } from 'element-ui'
    import { EditIcon, TrashIcon } from 'vue-feather-icons'
    
    export default {
        components: {
            EditIcon,
            TrashIcon,
            [Tooltip.name]: Tooltip,
            [Popover.name]: Popover
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
                this.onMenuClickOutside()
                this.emitter('show-modal')
            },
            onDuplicateWidget() {
                this.onMenuClickOutside()
                this.emitter('duplicate-widget')
            },
            onRemoveWidget() {
                this.onMenuClickOutside()
                this.emitter('remove-item')
            },
            emitter(event) {
                this.$emit(event)
            },
        },
    }
</script>
<style lang="scss" scoped>
.rtl .card-action_container {
    @apply ml-4;
}
.menu-action_item {
    @apply w-full rounded text-gray-700 flex items-center px-2 py-2 overflow-auto cursor-pointer;
    &:hover {
        color: var(--primary-color);
    }
}
*:focus {
    outline: none;
}
</style>
