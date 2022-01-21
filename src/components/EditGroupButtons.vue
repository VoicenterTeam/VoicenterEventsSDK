<template>
    <div>
        <div class="flex items-center">
            <div class="flex items-center cursor-pointer text-steel hover:text-primary"
                 @click="tryAddWidgets">
                <IconAddWidget/>
                <div class="mx-2">
                    {{ $t('widget.addNewWidgets') }}
                </div>
            </div>
            <template v-if="getLayoutType === layoutTypes.TABBED">
                <IconDirLeft class="cursor-pointer text-steel hover:text-primary"
                             @click="onMove('up')"/>
                <IconDirRight class="cursor-pointer mx-2 text-steel hover:text-primary"
                              @click="onMove('down')"/>
            </template>
            <template v-if="getLayoutType === layoutTypes.LIST">
                <el-tooltip :content="$t('tooltip.reorder.dashboard.layout')"
                            class="item"
                            :open-delay="openDelay"
                            effect="dark"
                            placement="top">
                    <div class="flex items-center hover:text-primary cursor-pointer"
                         @click="tryReorderWidgetGroups">
                        <IconDirUp class="text-steel"/>
                        <IconDirDown class="text-steel"/>
                    </div>
                </el-tooltip>
            </template>
            <el-tooltip :content="$t('tooltip.remove.group')"
                        class="item"
                        effect="dark"
                        :open-delay="openDelay"
                        placement="top">
                <IconDelete @click="$emit('remove-group', widgetGroup)"
                            class="text-red cursor-pointer hover:text-red-focus mx-2">
                </IconDelete>
            </el-tooltip>
            <AddWidgetDialog
                :visible.sync="showAddWidgetDialog"
                v-if="showAddWidgetDialog"
                :widget-group="widgetGroup"
                v-on="$listeners"
                @try-store-category="tryAddAllWidgetsFromCategory"
                @on-submit="showAddWidgetDialog = false"
                @on-cancel="showAddWidgetDialog = false"
            />
        </div>
        <ConfirmDialog v-if="showConfirmDialog"
                       :visible.sync="showConfirmDialog">
            <template v-slot:title>
                <h3 class="text-main-2xl font-semibold text-gray-700">
                    {{ $t('general.saveChanges') }}
                </h3>
            </template>
            <div class="flex justify-center w-full">
                <div class="text-center text-gray-900 text-main-sm leading-21 my-6 max-w-65-p">
                    {{ $t('layout.saveChangesInTheExistingThemeOrNew') }}
                </div>
            </div>
            <template v-slot:footer-actions>
                <slot name="footer-actions">
                    <base-button class="mx-4"
                                @click="onCancel"
                                variant="discard"
                                fixed-width="w-37">
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="mx-1 text-base font-bold">{{ 'common.cancel' }}</span>
                        </div>
                    </base-button>
                    <base-button @click="addAllWidgetsFromCategory"
                                 key="store">
                        {{ $t('common.confirm') }}
                    </base-button>
                </slot>
            </template>
        </ConfirmDialog>
        <ReorderWidgetGroupDialog v-if="showReorderLayoutDialog"
            :widget-group-list="activeDashboardData.WidgetGroupList"
            :visible.sync="showReorderLayoutDialog"
            @on-cancel="showReorderLayoutDialog = false"
            @on-submit="showReorderLayoutDialog = false"
            @reorder-widgets-in-modal="reorderWidgetsInModal"
        />
    </div>
</template>
<script>
    import { layoutTypes } from '@/enum/layout'
    import { Trash2Icon } from 'vue-feather-icons'
    import { getDefaultGridLayout } from '@/helpers/util'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import AddWidgetDialog from '@/components/Widgets/AddWidgetsForm/AddWidgetDialog'
    import ReorderWidgetGroupDialog from '@/components/LayoutRendering/ReorderWidgetGroupDialog'
    
    export default {
        inheritAttrs: false,
        name: 'edit-group-buttons',
        components: {
            Trash2Icon,
            ConfirmDialog,
            AddWidgetDialog,
            ReorderWidgetGroupDialog,
        },
        props: {
            widgetGroup: {
                type: Object,
                default: () => ({}),
            },
            activeDashboardData: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                openDelay: 200,
                showAddWidgetDialog: false,
                showReorderLayoutDialog: false,
                layoutTypes,
                showConfirmDialog: false,
                selectedCategory: null,
            }
        },
        computed: {
            getLayoutType() {
                return localStorage.getItem('layout-type') || layoutTypes.TABBED
            },
        },
        methods: {
            tryAddWidgets() {
                this.showAddWidgetDialog = true
            },
            onMove(direction) {
                const objToEmit = {
                    direction: direction,
                    widgetGroup: this.widgetGroup,
                }
                this.$emit('on-reorder-widget-group', objToEmit)
            },
            tryAddAllWidgetsFromCategory(category) {
                this.selectedCategory = category
            },
            addAllWidgetsFromCategory() {
                const templates = this.composePayload()
                this.addWidgets(templates)
            },
            composePayload() {
                let defaultLayout = getDefaultGridLayout()
                return this.selectedCategory.map((template) => ({
                    template,
                    WidgetLayout: { GridLayout: defaultLayout },
                }))
            },
            addWidgets(templates) {
                this.$emit('add-widgets-to-group', templates)
                this.showConfirmDialog = false
            },
            onCancel() {
                this.showConfirmDialog = false
                this.selectedCategory = null
            },
            tryReorderWidgetGroups() {
                this.showReorderLayoutDialog = !this.showReorderLayoutDialog
            },
            reorderWidgetsInModal () {
                this.onMove('move')
            }
        },
    }
</script>
