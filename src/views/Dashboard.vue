<template>
    <div class="transition flex relative flex-col dashboard-wrapper">
        <div class="overflow-hidden h-8 w-full bg-transparent px-4" v-if="onFullScreen">
            <div @click="triggerFullScreenMode"
                 :class="$rtl.isRTL ? 'mr-auto' : 'right-0'"
                 class="flex w-full justify-end items-center cursor-pointer h-10 focus:outline-none text-gray-550 hover:text-primary">
                <IconExitFullScreen class="mx-2"/>
                {{ $t('Exit Full Screen') }}
            </div>
        </div>
        <socket-status-alert @retry="retrySocketConnection"/>
        <base-navbar v-if="!onFullScreen && activeDashboardData"
                     key="base-navbar">
            <template v-slot:dashboard-operations>
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
        <div class="dashboard" v-loading="loadingData" :key="activeLanguage">
            <div class="dashboard-container min-h-screen mb-10"
                 v-if="dashboard">
                <fade-transition :duration="150" mode="out-in">
                    <sidebar v-if="(showTabs || editMode) && !onFullScreen"
                             :active-tab="activeTab"
                             :widget-group-list="activeDashboardData.WidgetGroupList"
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
                <div class="p-2"
                     :class="{'p-2 md:p-6': !onFullScreen}"
                     :key="activeDashboardData.DashboardID">
                    <fade-transition :duration="250" mode="out-in">
                        <component :active-tab="activeTab"
                                   :edit-mode="editMode"
                                   :is="layoutTypes[layoutType]"
                                   :active-dashboard-data="activeDashboardData"
                                   :layout-type="layoutType"
                                   :storing-data="storingData"
                                   :widget-group-list="groupsToDisplay"
                                   :widget-templates="allWidgetTemplates"
                                   @add-widgets-to-group="addWidgetsToGroup"
                                   @duplicate-widget="duplicateWidget"
                                   @on-edit-widget-group="onEditWidgetGroup"
                                   @remove-group="(widgetGroup) => tryRemoveWidgetGroup(widgetGroup)"
                                   @remove-widget="(data) => removeWidget(data.widget, data.group)"
                                   @switch-tab="(tab) => switchTab(tab)"
                                   @update-widget="(data) => updateWidget(data.widget, data.group)"
                                   @on-reorder-widget-group="onReorderWidgetGroup"
                        />
                    </fade-transition>
                </div>
            </div>
        </div>
        <ConfirmDialog :visible.sync="showConfirmDialog"
                       :description="`Are you sure that you want to delete this Widget Group #${get(groupToRemove, 'WidgetGroupID', '- -')}?`"
                       @on-cancel="showConfirmDialog = false"
                       @on-confirm="removeWidgetGroup"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import orderBy from 'lodash/orderBy'
    import cloneDeep from 'lodash/cloneDeep'
    import { targets, types } from '@/enum/operations'
    import pageSizeMixin from '@/mixins/pageSizeMixin'
    import NewGroupButton from '@/components/NewGroupButton'
    import Sidebar from '@/components/LayoutRendering/Sidebar'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import Switcher from '@/components/LayoutRendering/Switcher'
    import DashboardOperations from '@/helpers/DashboardOperations'
    import { retrySocketConnection } from '@/plugins/initRealTimeSdk'
    import { runDashboardOperations } from '@/services/dashboardService'
    import ListView from '@/components/LayoutRendering/Types/ListView'
    import SocketStatusAlert from '@/components/Common/SocketStatusAlert'
    import TabbedView from '@/components/LayoutRendering/Types/TabbedView'
    import { dashboardOperation } from '@/models/instances'
    import SocketStatusButton from '@/components/Common/SocketStatusButton'
    import ManageDashboardButtons from '@/components/ManageDashboardButtons'
    import { ACTIVE_WIDGET_GROUP_KEY, LAYOUT_TYPE_KEY, layoutTypes } from '@/enum/layout'
    import addEntitiesMixin from '@/mixins/dashobardOperation/addEntitiesMixin'
    import removeEntitiesMixin from '@/mixins/dashobardOperation/removeEntitiesMixin'
    import updateEntitiesMixin from '@/mixins/dashobardOperation/updateEntitiesMixin'
    
    export default {
        components: {
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
                    return [this.groupToEdit]
                }
                return this.activeDashboardData.WidgetGroupList
            },
        },
        methods: {
            get,
            retrySocketConnection,
            async saveDashboard() {
                this.loading = true
                this.editMode = false
                this.storingData = true
                
                if (this.groupToEdit) {
                    const currentGroup = this.groupToEdit
                    this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET_GROUP, currentGroup))
                    await this.updateGridStacks(currentGroup)
                }
                
                await this.validateOrderedGroups()
                
                let dashboard = await runDashboardOperations(this.operations, this.activeDashboardData)
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
                    this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET_GROUP, group))
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
                this.resetProgress()
                this.loading = false
            },
            resetProgress() {
                this.operations = new DashboardOperations()
            },
            triggerFullScreenMode() {
                this.onFullScreen = !this.onFullScreen
            },
            onEditWidgetGroup(group) {
                this.groupToEdit = group
                this.editMode = true
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
        },
        created() {
            window.grids = []
        },
        watch: {
            dashboard: {
                immediate: true,
                handler: function () {
                    let dashboard = cloneDeep(this.$store.getters['dashboards/getActiveDashboard'])
                    this.sortDashboardEntities(dashboard)
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
</style>
