<template>
    <div class="transition flex relative flex-col dashboard-wrapper">
        <div class="overflow-hidden h-8 w-full bg-transparent px-4" v-if="onFullScreen">
            <div @click="triggerFullScreenMode"
                :class="$rtl.isRTL ? 'mr-auto' : 'right-0'"
                class="flex w-full justify-end items-center cursor-pointer h-8 focus:outline-none text-primary"
            >
                <IconExitFullScreen class="mx-2"/>
                {{ $t('Exit Full Screen') }}
            </div>
        </div>
        <socket-status-alert @retry="retrySocketConnection"/>
        <base-navbar
            v-if="!onFullScreen"
            key="base-navbar"
            :editMode="editMode"
            layoutType="activeLayout">
            <template v-slot:dashboard-operations>
                <div v-if="layoutType !== 'tabbed'"
                     class="flex items-center">
                    <new-group-button
                        :disabled="editMode"
                        @click="addNewGroup"
                    />
                    <IconVerticalLine class="mx-6 h-12"/>
                </div>
                <div class="flex items-center">
                    <layout-switcher :active-type="layoutType"
                                     :edit-mode="editMode"
                                     @set-edit-mode="onSetEditMode"
                                     @on-fullscreen="triggerFullScreenMode"
                                     @switch-layout="(type) => switchDashboardLayout(type)"
                    />
                </div>
            </template>
        </base-navbar>
        <AccountNoData v-if="accountNoData"/>
        <div class="dashboard"
             v-else
             v-loading="loadingData"
             :key="activeLanguage">
            <div class="dashboard-container min-h-screen mb-10"
                 v-if="dashboard"
            >
                <fade-transition :duration="300" mode="out-in">
                    <sidebar v-if="(showTabs || editMode) && showSidebar && !onFullScreen"
                             :active-tab="activeTab"
                             :widget-group-list="activeDashboardData.WidgetGroupList"
                             :layout-type="layoutType"
                             @switch-tab="(tab) => switchTab(tab)"
                             @add-new-group="addNewGroup"
                             :show-tabs="showTabs"
                             :edit-mode="editMode"
                             @exit-edit-mode="resetDashboard"
                             @save-dashboard="saveDashboard"
                             @on-edit-widget-group="onEditWidgetGroup"
                             @on-remove-widget-group="(widgetGroup) => tryRemoveWidgetGroup(widgetGroup)"
                    />
                </fade-transition>
                <div class="flex justify-center w-full">
                    <div v-if="(showTabs || editMode) && !onFullScreen"
                         class="w-20 bg-gray-400 text-gray-600 hover:text-primary h-3 w-20 rounded-b-2xl text-white cursor-pointer flex items-center justify-center"
                         @click="toggleSidebarState">
                        <IconArrowUp v-if="showSidebar"/>
                        <IconArrowDown v-else/>
                    </div>
                </div>
                <div
                    class="p-1"
                    :class="{'px-2 md:p-6': !onFullScreen}"
                    :key="activeDashboardData.DashboardID"
                >
                    <div
                        v-if="onFullScreen && showActiveWidgetGroupName"
                        class="font-bold text-xl text-gray pl-2 mb-4"
                    >
                        {{ showActiveWidgetGroupName}}
                    </div>
                    <fade-transition :duration="250" mode="out-in">
                        <component
                            :active-tab="activeTab"
                            :edit-mode="editMode"
                            :is="layoutTypes[layoutType]"
                            :active-dashboard-data="activeDashboardData"
                            :layout-type="layoutType"
                            :storing-data="storingData"
                            :widget-group-list="groupsToDisplay"
                            :widget-templates="allWidgetTemplates"
                            :editedGroup="groupToEdit"
                            @add-widgets-to-group="addWidgetsToGroup"
                            @duplicate-widget="duplicateWidget"
                            @on-edit-widget-group="onEditWidgetGroup"
                            @remove-group="(widgetGroup) => tryRemoveWidgetGroup(widgetGroup)"
                            @remove-widget="(data) => removeWidget(data.widget, data.group)"
                            @switch-tab="(tab) => switchTab(tab)"
                            @update-widget="(data) => updateWidget(data.widget, data.group)"
                            @on-reorder-widget-group="(data) => onReorderWidgetGroup(data)"
                        />
                    </fade-transition>
                </div>
            </div>
        </div>
        <ConfirmDialog :visible.sync="showConfirmDialog"
                       description="Are you sure that you want to delete this Widget Group"
                       @on-cancel="showConfirmDialog = false"
                       @on-confirm="removeWidgetGroup"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import orderBy from 'lodash/orderBy'
    import cloneDeep from 'lodash/cloneDeep'
    import AccountNoData from '@/views/AccountNoData'
    import { targets, types } from '@/enum/operations'
    import pageSizeMixin from '@/mixins/pageSizeMixin'
    import NewGroupButton from '@/components/NewGroupButton'
    import { dashboardOperation } from '@/models/instances'
    import Sidebar from '@/components/LayoutRendering/Sidebar'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import Switcher from '@/components/LayoutRendering/Switcher'
    import DashboardOperations from '@/helpers/DashboardOperations'
    import { retrySocketConnection } from '@/plugins/initRealTimeSdk'
    import { runDashboardOperations } from '@/services/dashboardService'
    import ListView from '@/components/LayoutRendering/Types/ListView'
    import SocketStatusAlert from '@/components/Common/SocketStatusAlert'
    import TabbedView from '@/components/LayoutRendering/Types/TabbedView'
    import SocketStatusButton from '@/components/Common/SocketStatusButton'
    import ManageDashboardButtons from '@/components/ManageDashboardButtons'
    import addEntitiesMixin from '@/mixins/dashobardOperation/addEntitiesMixin'
    import removeEntitiesMixin from '@/mixins/dashobardOperation/removeEntitiesMixin'
    import updateEntitiesMixin from '@/mixins/dashobardOperation/updateEntitiesMixin'
    import { ACTIVE_WIDGET_GROUP_KEY, LAYOUT_TYPE_KEY, layoutTypes } from '@/enum/layout'

    export default {
        components: {
            AccountNoData,
            ManageDashboardButtons,
            [Switcher.name]: Switcher,
            NewGroupButton,
            ListView,
            TabbedView,
            Sidebar,
            SocketStatusButton,
            SocketStatusAlert,
            ConfirmDialog,
        },
        mixins: [pageSizeMixin, removeEntitiesMixin, addEntitiesMixin, updateEntitiesMixin],
        props: {
            showLoadingIndicator: {
                type: Boolean,
                default: true,
            },
            accountNoData: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                loading: false,
                editMode: false,
                activeDashboardData: null,
                layoutTypes: {
                    [layoutTypes.LIST]: 'ListView',
                    [layoutTypes.TABBED]: 'TabbedView',
                },
                layoutType: localStorage.getItem(LAYOUT_TYPE_KEY) || 'tabbed',
                previousLayoutType: '',
                operations: new DashboardOperations(),
                activeTab: localStorage.getItem(ACTIVE_WIDGET_GROUP_KEY) || '',
                groupToEdit: null,
                storingData: false,
                onFullScreen: false,
                showSidebar: true,
            }
        },
        computed: {
            loadingData() {
                if (!this.showLoadingIndicator) {
                    return false
                }
                return this.$store.state.dashboards.loadingData || this.loading
            },
            activeLanguage() {
                return this.$store.state.lang.language
            },
            dashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            clonedDashboard () {
                return cloneDeep(this.dashboard)
            },
            allWidgetTemplates() {
                return this.$store.state.widgetTemplate.allWidgetTemplates
            },
            showTabs() {
                return this.layoutType === layoutTypes.TABBED
            },
            activeWidgetGroupID() {
                return this.activeTab || get(this.$store.state.dashboards.activeDashboard, 'WidgetGroupList[0].WidgetGroupID')
            },
            groupsToDisplay() {
                if (this.editMode) {
                    this.$nextTick(() => {
                        return [this.groupToEdit]
                    })
                }
                return this.activeDashboardData.WidgetGroupList
            },
            showActiveWidgetGroupName () {
                const activeWidgetGroup = this.activeDashboardData.WidgetGroupList.find(el => Number(el.WidgetGroupID) === Number(this.activeWidgetGroupID))
                return activeWidgetGroup.WidgetGroupTitle || this.$t('Group ID') +': '+ activeWidgetGroup.WidgetGroupID
            }
        },
        methods: {
            get,
            retrySocketConnection,
            async saveDashboard() {
                this.loading = true
                this.editMode = false
                this.storingData = true
                const wGrids = window.grids

                if (this.groupToEdit) {
                    const currentGroup = this.groupToEdit
                    await this.updateGridStacks(currentGroup, wGrids)
                }
                await this.validateOrderedGroups()

                let dashboard = await runDashboardOperations(this.operations, this.activeDashboardData, this.clonedDashboard)
                await this.$store.dispatch('dashboards/updateDashboard', dashboard)

                this.operations = new DashboardOperations()
                this.storingData = false
                this.groupToEdit = null
                this.loading = false
            },
            async validateOrderedGroups() {
                const currentGroups = this.activeDashboardData.WidgetGroupList
                currentGroups.forEach((group, index) => {
                    group['Order'] = +index
                    const operationType = group.IsNew ? types.ADD : types.UPDATE
                    this.operations.add(dashboardOperation(operationType, targets.WIDGET_GROUP, group))
                })
            },
            switchDashboardLayout(type) {
                this.layoutType = type
                this.saveLayoutType(type)
            },
            saveLayoutType(type) {
                localStorage.setItem(LAYOUT_TYPE_KEY, type)
            },
            saveActiveTab(tab) {
                localStorage.setItem(ACTIVE_WIDGET_GROUP_KEY, tab)
            },
            switchTab(tab) {
                this.loading = true
                this.activeTab = tab
                this.saveActiveTab(tab)
                this.loading = false
            },
            triggerFullScreenMode() {
                this.onFullScreen = !this.onFullScreen
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen()
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    }
                }
            },
            onEditWidgetGroup(group) {
                this.$nextTick(() => {
                    this.editMode = true
                    this.groupToEdit = group
                })
            },
            async onSetEditMode() {
                this.groupToEdit = this.activeDashboardData.WidgetGroupList[0]
                await this.$store.dispatch('dashboards/setActiveGroup', this.groupToEdit)
                this.editMode = true
            },
            sortDashboardEntities(dashboard) {
                try {
                    dashboard.WidgetGroupList = orderBy(dashboard.WidgetGroupList, 'Order', 'asc')
                    dashboard.WidgetGroupList = dashboard.WidgetGroupList.map((widgetGroup) => {
                        let WidgetList = orderBy(widgetGroup.WidgetList, 'WidgetLayout.Order', 'asc')
                        return {
                            ...widgetGroup,
                            WidgetList,
                        }
                    })
                    this.activeDashboardData = dashboard
                } catch (e) {
                }
            },
            toggleSidebarState() {
                this.showSidebar = !this.showSidebar
            },
            renderDashboard() {
                let dashboard = cloneDeep(this.$store.getters['dashboards/getActiveDashboard'])
                this.sortDashboardEntities(dashboard)
            },
        },
        created() {
            window.grids = []
        },
        mounted() {
            this.renderDashboard()
        },
        watch: {
            dashboard: {
                immediate: true,
                handler() {
                    this.renderDashboard()
                },
            },
            activeWidgetGroupID: {
                immediate: true,
                handler(newVal) {
                    this.switchTab(newVal)
                },
            },
        },
    }
</script>
<style lang="scss">
.dashboard-wrapper {
    @apply w-full;
}

.flip-list-move {
    transition: transform 0.5s;
}

.el-table__row .cell {
    @apply text-gray-500;
}

.rtl .el-dialog__headerbtn {
    left: 20px;
    right: auto;
}

.rtl .el-button--default {
    margin-left: 10px;
}

.dashboard > .el-loading-mask > .el-loading-spinner {
    @apply fixed;
}

.transition {
    transition: all 0.3s ease-in;
}

.rounded-b-2xl {
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 1rem;
}
</style>
