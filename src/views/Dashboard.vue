<template>
    <div>
        <socket-status-alert @retry="retrySocketConnection"/>
        <base-navbar>
            <template v-slot:dashboard-operations>
                <div class="flex">
                    <div class="my-3 flex items-center">
                        <div @click="showReorderDataDialog = true" class="mx-1 cursor-pointer" v-if="!editMode">
                            <el-tooltip :content="$t('tooltip.reorder.dashboard.layout')" class="item" effect="dark"
                                        placement="bottom">
                                <button class="btn p-2 shadow rounded bg-white hover:bg-primary-100">
                                    <ListIcon class="w-5 h-5 text-primary"/>
                                </button>
                            </el-tooltip>
                        </div>
                        <new-group-button
                            @click.native="addNewGroup"
                            v-if="editMode">
                        </new-group-button>
                        <AddButton @click.stop="showWidgetMenu = !showWidgetMenu" class="mx-1"
                                   v-if="editMode && firstWidgetGroup">
                        </AddButton>
                        <manage-dashboard-buttons
                            :edit-mode="editMode"
                            :layoutType="layoutType"
                            :widgetGroupList="activeDashboardData.WidgetGroupList"
                            @edit-group="onEditGroup"
                            @remove-widget-group="removeWidgetGroup"
                            @reset-dashboard="resetDashboard"
                            @save-dashboard="saveDashboard">
                        </manage-dashboard-buttons>
                    </div>
                    <fade-transition>
                        <templates-category
                            :widgetGroup="firstWidgetGroup"
                            :widgetTemplates="allWidgetTemplates"
                            @addWidgetsToGroup="addWidgetsToGroup"
                            class="mt-16"
                            v-click-outside="onWidgetMenuClickOutside"
                            v-if="showWidgetMenu">
                        </templates-category>
                    </fade-transition>
                    <layout-switcher
                        :activeType="layoutType"
                        @switch-layout="(type) => switchDashboardLayout(type)"
                        v-if="!editMode">
                    </layout-switcher>
                </div>
            </template>
        </base-navbar>
        <div class="dashboard" element-loading-background="transparent" v-loading="loading" :key="activeLanguage">
            <div class="dashboard-container min-h-screen pb-10" v-if="dashboard">
                <sidebar :activeTab="activeTab"
                         :widgetGroupList="activeDashboardData.WidgetGroupList"
                         @switch-tab="(tab) => switchTab(tab)"
                         v-if="showSidebar"/>
                <div :class="getClass" :key="activeDashboardData.DashboardID" class="pt-12 px-6 md:px-12">
                    <fade-transition :duration="250" mode="out-in">
                        <component
                            :activeTab="activeTab"
                            :editMode="editMode"
                            :is="layoutTypes[layoutType]"
                            :layoutType="layoutType"
                            :storingData="storingData"
                            :widgetGroupList="groupsToDisplay"
                            :widgetTemplates="allWidgetTemplates"
                            @addWidgetsToGroup="addWidgetsToGroup"
                            @removeGroup="(widgetGroup) => removeWidgetGroup(widgetGroup)"
                            @removeWidget="(data) => removeWidget(data.widget, data.group)"
                            @switch-tab="(tab) => switchTab(tab)"
                            @updateWidget="(data) => updateWidget(data.widget, data.group)">
                        </component>
                    </fade-transition>
                </div>
            </div>
            <reorder-layout-dialog
                :visible.sync="showReorderDataDialog"
                :widgetGroupList="activeDashboardData.WidgetGroupList"
                :width="'50%'"
                @on-cancel="triggerReorderDataDialog"
                @on-submit="reorderWidgetGroup"
                @removeWidget="(data) => removeWidget(data.widget, data.group)"
                v-if="showReorderDataDialog"
            />
        </div>
    </div>
</template>
<script>
    import map from 'lodash/map'
    import get from 'lodash/get'
    import {Tooltip} from 'element-ui'
    import orderBy from 'lodash/orderBy'
    import isEqual from 'lodash/isEqual'
    import bus from '@/event-bus/EventBus'
    import cloneDeep from 'lodash/cloneDeep'
    import {ListIcon} from 'vue-feather-icons'
    import AddButton from '@/components/AddButton'
    import {targets, types} from '@/enum/operations'
    import draggableEvents from '@/enum/draggableEvents'
    import pageSizeMixin from '@/mixins/pageSizeMixin'
    import NewGroupButton from '@/components/NewGroupButton'
    import WidgetMenu from '@/components/Widgets/WidgetMenu'
    import Sidebar from '@/components/LayoutRendering/Sidebar'
    import Switcher from '@/components/LayoutRendering/Switcher'
    import DashboardOperations from '@/helpers/DashboardOperations'
    import {retrySocketConnection} from '@/plugins/initRealTimeSdk'
    import {runDashboardOperations} from '@/services/dashboardService'
    import ListView from '@/components/LayoutRendering/Types/ListView'
    import SocketStatusAlert from '@/components/Common/SocketStatusAlert'
    import TabbedView from '@/components/LayoutRendering/Types/TabbedView'
    import TemplatesCategory from '@/components/Widgets/TemplatesCategory'
    import {dashboardOperation, widgetGroupModel} from '@/models/instances'
    import ManageDashboardButtons from '@/components/ManageDashboardButtons'
    import ReorderLayoutDialog from '@/components/Common/ReorderLayoutDialog'
    import {createNewWidgets, removeDummyWidgets} from '@/services/widgetService'
    import {ACTIVE_WIDGET_GROUP_KEY, LAYOUT_TYPE_KEY, layoutTypes} from '@/enum/layout'

    export default {
        components: {
            ManageDashboardButtons,
            [Switcher.name]: Switcher,
            NewGroupButton,
            AddButton,
            WidgetMenu,
            ListView,
            TabbedView,
            Sidebar,
            TemplatesCategory,
            SocketStatusAlert,
            ReorderLayoutDialog,
            [Tooltip.name]: Tooltip,
            ListIcon,
        },
        mixins: [pageSizeMixin],
        data () {
            return {
                showWidgetMenu: false,
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
                showReorderDataDialog: false,
                groupToEdit: null,
                storingData: false
            }
        },
        computed: {
            activeLanguage () {
                return this.$store.state.lang.language
            },
            loading () {
                return this.$store.state.dashboards.loadingData;
            },
            dashboard () {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            allWidgetTemplates () {
                return this.$store.state.widgetTemplate.allWidgetTemplates
            },
            getClass () {
                if (this.layoutType === layoutTypes.TABBED) {
                    return 'pt-24'
                }
            },
            showSidebar () {
                return this.layoutType === layoutTypes.TABBED;
            },
            token () {
                return this.$store.state.users.tokenString
            },
            extensions () {
                return this.$store.state.extensions.extensions
            },
            queues () {
                return this.$store.state.queues.all
            },
            firstWidgetGroup () {
                return this.activeDashboardData.WidgetGroupList[0]
            },
            activeWidgetGroupID () {
                return this.activeTab || get(this.$store.state.dashboards.activeDashboard, 'WidgetGroupList[0].WidgetGroupID')
            },
            groupsToDisplay () {
                if (this.editMode) {
                    return [this.groupToEdit]
                }
                return this.dashboard.WidgetGroupList
            }
        },
        methods: {
            retrySocketConnection,
            onEditGroup (widgetGroup) {
                this.groupToEdit = widgetGroup
                this.editMode = true
                this.operations = new DashboardOperations()

                if (!widgetGroup) {
                    this.groupToEdit = {...widgetGroupModel}
                    this.activeDashboardData.WidgetGroupList = [this.groupToEdit]
                }
            },
            async addWidgetsToGroup (data = {}) {
                let {widgets: widgetTemplates, group: widgetGroup} = data
                let createdWidgets = await createNewWidgets(widgetTemplates, widgetGroup)

                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)

                if (!widgetGroup.IsNew) {
                    for (let widget of createdWidgets) {
                        this.operations.add(dashboardOperation(types.ADD, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                    }
                }

                this.activeDashboardData.WidgetGroupList[index].WidgetList = this.activeDashboardData.WidgetGroupList[index].WidgetList.concat(createdWidgets)
                this.showWidgetMenu = false
                this.groupToEdit = this.activeDashboardData.WidgetGroupList[index]

                bus.$emit('added-widgets', createdWidgets);
            },
            reorderWidgetGroup (data = {}) {
                let {allGroups: allWidgetGroups, groupsToUpdate: groupsToUpdate, widgetsToUpdate: widgetsToUpdate} = data
                this.activeDashboardData.WidgetGroupList = allWidgetGroups

                groupsToUpdate.forEach((group) => {
                    this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET_GROUP, group))
                })

                widgetsToUpdate.forEach((widget) => {
                    if (!widget.operation) {
                        this.operations.add(dashboardOperation(types.MOVED, targets.WIDGET, widget))
                    } else {
                        switch (widget.operation.type) {
                            case draggableEvents.ADDED:
                                delete widget.WidgetLayout.GridLayout
                                this.operations.add(dashboardOperation(types.MOVED_IN, targets.WIDGET, widget, widget.operation.parentID))
                                break
                            case draggableEvents.REMOVED:
                                this.operations.add(dashboardOperation(types.MOVED_OUT, targets.WIDGET, widget, widget.operation.parentID))
                                break
                        }
                    }
                })

                this.showReorderDataDialog = false
                this.saveDashboard()
            },
            onWidgetMenuClickOutside () {
                this.showWidgetMenu = false
            },
            removeWidget (widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.WidgetID === widget.WidgetID)
                    if (widgetIndex !== -1) {
                        this.activeDashboardData.WidgetGroupList[index].WidgetList.splice(widgetIndex, 1)
                        this.groupToEdit = this.activeDashboardData.WidgetGroupList[index]
                        if (!widgetGroup.IsNew) {
                            this.operations.add(dashboardOperation(types.REMOVE, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                        } else {
                            removeDummyWidgets([widget.WidgetID])
                        }
                    }
                }
            },
            async removeWidgetGroup (widgetGroup) {
                await this.$confirm(
                    this.$t('common.confirm.question', {
                        action: this.$t('to delete this widget group'),
                    }), this.$t('Delete Widget Group'), {
                        cancelButtonText: this.$t('common.cancel'),
                        confirmButtonText: this.$t('common.confirm'),
                    }).then(() => {

                    let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)

                    if (index !== -1) {
                        this.activeDashboardData.WidgetGroupList.splice(index, 1)
                        let widgetIds = map(widgetGroup.WidgetList, 'WidgetID')
                        removeDummyWidgets(widgetIds)

                        if (!widgetGroup.IsNew) {
                            this.operations.removeGroup(dashboardOperation(types.REMOVE, targets.WIDGET_GROUP, widgetGroup))
                            this.saveDashboard()
                        }
                    }
                    this.editMode = false
                })
            },
            addNewGroup () {
                const group = {...widgetGroupModel}
                this.groupToEdit = group

                this.activeDashboardData.WidgetGroupList.splice(0, 0, group)
                this.activeDashboardData.WidgetGroupList.forEach((group, index) => {
                    group.Order = index
                })
            },
            updateWidget (widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {

                    let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.WidgetID === widget.WidgetID)
                    if (widgetIndex !== -1 && !widgetGroup.IsNew) {
                        this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET, widget, widgetGroup.WidgetGroupID))

                        this.activeDashboardData.WidgetGroupList[index].WidgetList.splice(widgetIndex, 1, widget)

                        if (!this.editMode) {
                            this.saveDashboard()
                        } else {
                            this.groupToEdit = widgetGroup
                        }
                    }
                }
            },
            async saveDashboard () {
                this.editMode = false
                this.showWidgetMenu = false
                this.storingData = true

                if (this.groupToEdit) {
                    const currentGroup = this.groupToEdit
                    this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET_GROUP, currentGroup))
                    await this.updateGridStacks(currentGroup)
                }

                //RunDashboardOperations
                let dashboard = await runDashboardOperations(this.operations, this.activeDashboardData)
                await this.$store.dispatch('dashboards/updateDashboard', dashboard)
                this.operations = new DashboardOperations()
                this.storingData = false
                this.groupToEdit = null
            },
            updateGridStacks (group) {
                const activeDashboardWidgets = group.WidgetList
                window.grids.forEach(grid => {
                    grid.engine.nodes.forEach((node) => {
                        let widget = activeDashboardWidgets.find((widget) => Number(widget.WidgetID) === Number(node.id));
                        if (!widget) {
                            return
                        }
                        let nodeLayout = {
                            x: node.x,
                            y: node.y,
                            width: node.width,
                            height: node.height
                        }
                        let widgetGridLayout = widget.WidgetLayout.GridLayout

                        if (isEqual(widgetGridLayout, nodeLayout)) {
                            return
                        }

                        widget.WidgetLayout.GridLayout = nodeLayout
                        this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET, widget, group))
                    })

                })
            },
            resetDashboard () {
                this.showWidgetMenu = false
                this.editMode = false
                let dashboard = this.$store.state.dashboards.activeDashboard
                this.$store.dispatch('dashboards/updateDashboard', dashboard)
                this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
                this.operations = new DashboardOperations()

                this.storingData = true
                this.$nextTick(() => {
                    this.storingData = false
                })
            },
            switchDashboardLayout (type) {
                this.layoutType = type
                this.saveLayoutType(type)
            },
            saveLayoutType (type) {
                localStorage.setItem(LAYOUT_TYPE_KEY, type)
            },
            saveActiveTab (tab) {
                localStorage.setItem(ACTIVE_WIDGET_GROUP_KEY, tab)
            },
            switchTab (tab) {
                this.activeTab = tab
                this.saveActiveTab(tab)
            },
            sortDashboardEntities (dashboard) {
                try {
                    dashboard.WidgetGroupList = orderBy(dashboard.WidgetGroupList, 'Order', 'asc')
                    dashboard.WidgetGroupList = dashboard.WidgetGroupList.map((widgetGroup) => {
                        let WidgetList = orderBy(widgetGroup.WidgetList, 'WidgetLayout.Order', 'asc')
                        return {
                            ...widgetGroup,
                            WidgetList
                        }
                    })
                    this.activeDashboardData = dashboard
                } catch (e) {
                }
            },
            triggerReorderDataDialog () {
                this.resetDashboard()
                this.showReorderDataDialog = false
            }
        },
        created () {
            window.grids = []
        },
        watch: {
            dashboard: {
                immediate: true,
                handler: function () {
                    let dashboard = cloneDeep(this.$store.getters['dashboards/getActiveDashboard'])
                    this.sortDashboardEntities(dashboard)
                }
            },
            editMode (val) {
                this.$store.commit('dashboards/SET_EDIT_MODE', val)
                if (val) {
                    this.previousLayoutType = this.layoutType
                    this.layoutType = layoutTypes.LIST
                } else {
                    this.layoutType = this.previousLayoutType
                }
                this.saveLayoutType(this.layoutType)
            },
            activeWidgetGroupID: {
                immediate: true,
                handler (newVal) {
                    this.switchTab(newVal)
                }
            }
        },
    }
</script>
<style lang="scss">
    .editable-widgets {
        @apply rounded-lg;
        @apply shadow;
        @apply py-8;
        border-radius: 10px;
        min-width: 310px;
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
</style>
