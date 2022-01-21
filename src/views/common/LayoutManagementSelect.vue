<template>
    <div>
        <div v-click-outside="onMenuClickOutside"
             class="w-full relative layout-selection border-b sm:border-none pb-6 sm:pb-0">
            <div class="flex items-center mb-3 justify-between">
                <div class="flex">
                    <IconLayoutSelection class="text-primary"/>
                    <span class="mx-1 text-gray-900 text-main-sm font-medium truncate">
                        {{ $t('Layout Selection') }}
                    </span>
                </div>
                <el-tooltip :content="$t('Active/Inactive layouts')"
                            placement="top">
                    <el-switch :value="activeLayouts"
                               @change="onChangeLayoutType"/>
                </el-tooltip>
            </div>
            <button @click.stop="triggerMenu"
                    class="border h-10 border-gray-550 flex w-full items-center rounded cursor-pointer focus:outline-none justify-between px-4">
                <span class="mx-2 truncate">{{ selectedLayout.LayoutName }}</span>
                <div class="flex">
                    <IconArrowDown class="text-gray-500 transition"
                                   :class="{'is-expanded': showMenu}"/>
                </div>
            </button>
            <fade-transition :duration="fadeDuration">
                <div class="menu-wrapper"
                     v-if="showMenu">
                    <div class="layouts">
                        <div
                            :class="{'text-primary': selectedLayout.LayoutID === layout.LayoutID, 'readonly': !activeLayouts}"
                            @click="onChooseLayout(layout)"
                            class="flex flex-row items-center justify-between py-2 px-4 cursor-pointer layout-wrapper"
                            v-for="layout in filteredLayouts">
                            <div class="layout-option flex flex-row px-2 w-full  border border-transparent"
                                 :class="{'readonly': !activeLayouts}">
                                <div class="flex flex-col w-full">
                                    <p class="mb-1">{{ layout.LayoutName }}</p>
                                    <div class="flex flex-row pb-1 items-center justify-between w-full">
                                        <div class="flex">
                                            <div v-for="group in getColorParameters(layout)"
                                                 :key="group.JPath">
                                                <IconColorPicker class="w-4 h-4 mx-0-5"
                                                                 :style="getIndicatorStyles(group)"/>
                                            </div>
                                        </div>
                                        <template v-if="+layout.LayoutID !== +DEFAULT_LAYOUT_ID">
                                            <template v-if="activeLayouts">
                                                <div class="flex items-center">
                                                    <div @click.stop="onNewLayout"
                                                         class="mx-1 edit-justify-end items-center flex text-green-300">
                                                        <el-tooltip class="item" effect="dark"
                                                                    :content="$t('layout.editLayout')"
                                                                    placement="top">
                                                            <IconPencil class="w-4-5 h-4-5"/>
                                                        </el-tooltip>
                                                    </div>
                                                    <div @click.stop="tryDeleteLayout(layout)"
                                                         class="edit-justify-end items-center flex text-red-300">
                                                        <el-tooltip class="item" effect="dark"
                                                                    :content="$t('Move layout to bin')"
                                                                    placement="top">
                                                            <IconDelete class="w-4-5 h-4-5"/>
                                                        </el-tooltip>
                                                    </div>
                                                </div>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <el-tooltip
                                                :content="$t('This is a default config, please add a new one if you want to edit it')"
                                                placement="top">
                                                <AlertTriangleIcon class="text-orange-500 cursor-help w-4-5 h-4-5"/>
                                            </el-tooltip>
                                        </template>
                                    </div>
                                </div>
                                <template v-if="!activeLayouts">
                                    <div class="edit-flex justify-end items-center cursor-pointer"
                                         @click.stop="tryRestoreLayout(layout)">
                                        <el-tooltip :content="$t('Restore layout')"
                                                    placement="top">
                                            <RotateCcwIcon class="text-gray-400 w-4 hover:text-primary"/>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="h-16 px-4 py-2 flex items-center">
                        <div
                            class="cursor-pointer text-gray-550 hover:text-primary text-sm font-medium border border-dashed hover:border-primary rounded justify-center py-2 flex items-center w-full">
                            <IconAdd class="mb-0-5"/>
                            <div class="mx-1" @click="newLayout">
                                {{ $t('layout.createNew') }}
                            </div>
                        </div>
                    </div>
                </div>
            </fade-transition>
        </div>
        <ConfirmDialog v-if="showConfirmDialog"
                       :visible.sync="showConfirmDialog"
                       :description="$t('Are you sure you want enable layout?')"
                       :title="$t('Update status')">
            <template v-slot:footer-actions>
                <base-button class="mx-4"
                             @click="onCancel"
                             variant="discard"
                             fixed-width="w-37">
                    <div class="flex items-center">
                        <IconDiscard class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ 'Cancel' }}</span>
                    </div>
                </base-button>
                <base-button @click="onConfirm"
                             :loading="localLoading">
                    <div class="flex items-center">
                        <IconSave class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ 'common.confirm' }}</span>
                    </div>
                </base-button>
            </template>
        </ConfirmDialog>
        <DeleteLayout v-if="showDeleteDialog"
                      :is-active-layout="tryingDeleteActiveLayout"
                      @on-close="showDeleteDialog = false"
                      :visible.sync="showDeleteDialog"
                      :layout-to-remove="layoutToRemove"/>
    </div>
</template>
<script>
    import { Switch } from 'element-ui'
    import { LayoutApi } from '@/api/layoutApi'
    import { RotateCcwIcon } from 'vue-feather-icons'
    import { DEFAULT_LAYOUT_ID } from '@/enum/generic'
    import { AlertTriangleIcon } from 'vue-feather-icons'
    import DeleteLayout from '@/views/common/DeleteLayout'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import {
        DEFAULT_GROUP_KEYS,
        ENABLED_STATUS_ID,
        DELETED_STATUS_ID,
    } from '@/views/DashboardSettings/LayoutManagement/layout-management'
    
    const MAP_LAYOUT_STATUSES = {
        true: ENABLED_STATUS_ID,
        false: DELETED_STATUS_ID,
    }
    
    export default {
        components: {
            DeleteLayout,
            RotateCcwIcon,
            ConfirmDialog,
            AlertTriangleIcon,
            [Switch.name]: Switch,
        },
        data() {
            return {
                DEFAULT_LAYOUT_ID,
                localLoading: false,
                activeLayouts: true,
                currentAccountId: 1,
                showMenu: false,
                groupKeys: DEFAULT_GROUP_KEYS,
                fadeDuration: 250,
                layoutToRestore: null,
                showConfirmDialog: false,
                showDeleteDialog: false,
                layoutToRemove: false,
            }
        },
        computed: {
            tryingDeleteActiveLayout() {
                return this.layoutToRemove.LayoutID.toString() === this.selectedLayout.LayoutID.toString()
            },
            selectedLayout() {
                return this.$store.state.layout.activeLayout
            },
            globalLayout() {
                return this.$store.state.layout.globalLayout
            },
            getAccountLayouts() {
                return this.$store.state.layout.data || []
            },
            layoutsByStatus() {
                return this.getAccountLayouts.filter(layout => layout.LayoutStatusID === MAP_LAYOUT_STATUSES[this.activeLayouts])
            },
            filteredLayouts() {
                const result = this.layoutsByStatus
                if (!this.activeLayouts) {
                    return result
                }
                const globalLayoutIndex = result.findIndex(layout => layout.LayoutID.toString() === DEFAULT_LAYOUT_ID.toString())
                if (globalLayoutIndex === -1) {
                    result.splice(0, 0, this.globalLayout)
                }
                return result
            },
        },
        methods: {
            tryRestoreLayout(layout) {
                this.layoutToRestore = layout
                this.showConfirmDialog = true
            },
            tryDeleteLayout(layout) {
                this.showDeleteDialog = true
                this.layoutToRemove = layout
            },
            onChangeLayoutType(state) {
                this.activeLayouts = state
            },
            onNewLayout() {
                this.$router.push('layout-settings')
            },
            triggerMenu() {
                this.showMenu = !this.showMenu
            },
            onMenuClickOutside() {
                this.showMenu = false
            },
            onChooseLayout(layout) {
                if (!this.activeLayouts) {
                    return
                }
                this.$store.commit('layout/SET_ACTIVE_LAYOUT', layout)
                this.$emit('on-change-layout', layout)
                this.showMenu = false
            },
            getIndicatorStyles(config) {
                return {
                    'color': config.Value,
                }
            },
            getColorParameters(layout) {
                if (!layout) {
                    return []
                }
                const group = this.groupKeys['Colors']
                return this.getGroupedParameters(group, layout)
            },
            getGroupedParameters(group, layout) {
                return layout.LayoutParametersList.filter((el) => group.includes(el.LayoutParameterName))
            },
            newLayout() {
                this.$router.push('layout-settings')
            },
            onCancel() {
                this.showConfirmDialog = false
                this.layoutToRestore = null
            },
            async onConfirm() {
                try {
                    this.localLoading = true
                    const payload = {
                        ...this.layoutToRestore,
                        LayoutStatusID: ENABLED_STATUS_ID,
                        LayoutStatusName: 'Enable',
                    }
                    
                    await LayoutApi.update(payload)
                    await this.$store.dispatch('layout/setupLayouts')
                    await this.$store.dispatch('layout/getGlobalLayouts')
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.localLoading = false
                    this.onCancel()
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
.layout-selection ::v-deep {
    .menu-wrapper {
        @apply z-50 rounded bg-white mt-1 absolute w-full flex flex-col origin-top-right right-0 shadow-base;
        
        .layouts {
            @apply max-h-64 overflow-auto;
        }
    }
    
    .transition {
        transition: all 0.2s ease-in;
    }
    
    .is-expanded {
        transform: rotate(-180deg);
    }
    
    .layout-wrapper {
        :hover:not(.readonly) {
            @apply bg-primary-100 border border-primary text-primary;
        }
        
        .readonly {
            @apply bg-gray-200 text-gray-500 cursor-not-allowed;
        }
        
        .layout-option {
            @apply shadow-base flex-1 py-2 rounded;
            :hover {
                @apply bg-transparent border-none;
            }
        }
    }
    
    .el-switch.is-checked .el-switch__core {
        @apply border-primary bg-primary;
    }
}
</style>
