<template>
    <div
        v-click-outside="onMenuClickOutside"
        v-if="!editMode && isActiveGroup"
        class="actions-tabbed-view"
    >
        <el-popover
            trigger="manual"
            v-model="showMenuActions"
            :popper-options="
                { 
                    boundariesElement: 'body'
                }
            "
            :visible-arrow="false"
        >
            <IconOptions
                class="w-4 h-4 text-gray-500 hover:text-primary dots-icon"
                @click="triggerActionMenu" slot="reference"
                :class="{ 'text-primary': showMenuActions}"
            />
            <div
                class="menu-action_item"
                @click="onEditWidgetGroup()"
            >
                <IconPencil class="text-green w-4-5 h-4-5"/>
                <span class="mx-2 text-main-sm truncate">
                    {{ $t('dashboard.editGroup') }}
                </span>
            </div>
            <div
                class="menu-action_item border-t border-gray-300"
                @click="tryDeleteWidgetGroup()"
            >
                <IconDelete class="text-red w-4-5 h-4-5"/>
                <span class="mx-2 text-main-sm truncate">
                    {{ $t('dashboard.deleteGroup') }}
                </span>
            </div>
        </el-popover>
    </div>
</template>
<script>
    import { Popover } from 'element-ui'
    export default {
        components: {
            [Popover.name]: Popover
        },
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
                sideBarLine: null
            }
        },
        created () {
            this.sideBarLine = document.getElementById('sidebar-line')
            this.sideBarLine.addEventListener('scroll', this.actionScroll)
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
            actionScroll (event) {
                if (event) {
                    this.showMenuActions = false
                }
                console.log(event)
            }
        },
        destroyed() {
            this.sideBarLine.removeEventListener('scroll', this.actionScroll)
        }
    }
</script>
<style lang="scss" scoped>
.menu-action_item {
    @apply w-full rounded text-gray-700 flex items-center p-2 cursor-pointer;
    
    &:hover {
        color: var(--primary-color);
    }
}
.dots-icon:focus-within {
  outline: none !important;
}
</style>
