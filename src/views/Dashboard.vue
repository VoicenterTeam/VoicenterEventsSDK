<template>
    <div>
        <base-navbar>
            <template v-slot:dashboard-operations>
                <div class="flex">
                    <div class="my-3 flex items-center">
                        <div v-if="!editMode" class="mx-1 cursor-pointer" @click="showReorderDataDialog = true">
                            <el-tooltip class="item" effect="dark" :content="$t('tooltip.reorder.dashboard.layout')"
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
                        <AddButton class="mx-1" v-if="editMode && firstWidgetGroup"
                                   @click.stop="showWidgetMenu = !showWidgetMenu">
                        </AddButton>
                        <manage-dashboard-buttons
                            @click.stop="editMode = !editMode"
                            @reset-dashboard="resetDashboard"
                            @save-dashboard="saveDashboard"
                            :edit-mode="editMode">
                        </manage-dashboard-buttons>
                    </div>
                    <fade-transition>
                        <templates-category
                            class="mt-16"
                            v-if="showWidgetMenu"
                            :widgetGroup=firstWidgetGroup
                            @addWidgetsToGroup="addWidgetsToGroup"
                            v-click-outside="onWidgetMenuClickOutside"
                            :widgetTemplates="allWidgetTemplates">
                        </templates-category>
                    </fade-transition>
                    <layout-switcher
                        v-if="!editMode"
                        :activeType="layoutType"
                        @switch-layout="(type) => switchDashboardLayout(type)">
                    </layout-switcher>
                </div>
            </template>
        </base-navbar>
        <div v-loading="loading" class="dashboard" element-loading-background="rgba(255,255,255,.5)">
            <div v-if="activeDashboardData" class="dashboard-container">
                <sidebar v-if="showSidebar"
                         :activeTab="activeTab"
                         :widgetGroupList="activeDashboardData.WidgetGroupList"
                         @switch-tab="(tab) => switchTab(tab)"/>
                <div class="pt-24" :class="getClass" :key="activeDashboardData.DashboardID">
                    <fade-transition mode="out-in" :duration="250">
                        <keep-alive>
                            <component
                                :is="layoutTypes[layoutType]"
                                :layoutType="layoutType"
                                :activeDashboardData="activeDashboardData"
                                :editMode="editMode"
                                :activeTab="activeTab"
                                :widgetTemplates="allWidgetTemplates"
                                @removeGroup="(widgetGroup) => removeWidgetGroup(widgetGroup)"
                                @moveGroups="(data) => moveWidgetGroup(data.widgetGroup, data.direction)"
                                @onListChange="(data) => onListChange(data.event, data.group)"
                                @addWidgetsToGroup="addWidgetsToGroup"
                                @removeWidget="(data) => removeWidget(data.widget, data.group)"
                                @updateWidget="(data) => updateWidget(data.widget, data.group)"
                                @switch-tab="(tab) => switchTab(tab)">
                            </component>
                        </keep-alive>
                    </fade-transition>
                </div>
            </div>
            <reorder-layout-dialog
                :width="'50%'"
                v-if="showReorderDataDialog"
                :widgetGroupList="activeDashboardData.WidgetGroupList"
                :visible.sync="showReorderDataDialog"
                @on-submit="reorderWidgetGroup"
                @on-cancel="showReorderDataDialog = false"
            />
        </div>
    </div>
</template>
<script>
    import map from 'lodash/map'
    import get from 'lodash/get'
    import {Tooltip} from 'element-ui'
    import uniqBy from 'lodash/uniqBy'
    import orderBy from 'lodash/orderBy'
    import cloneDeep from 'lodash/cloneDeep'
    import {layoutTypes} from '@/enum/layout'
    import EventsSDK from 'voicenter-events-sdk'
    import differenceBy from 'lodash/differenceBy'
    import AddButton from '@/components/AddButton'
    import {sdkEventTypes} from '@/enum/sdkEvents'
    import parseCatch from '@/helpers/handleErrors'
    import {targets, types} from '@/enum/operations'
    import draggableEvents from '@/enum/draggableEvents'
    import pageSizeMixin from '@/mixins/pageSizeMixin'
    import NewGroupButton from '@/components/NewGroupButton'
    import WidgetMenu from '@/components/Widgets/WidgetMenu'
    import Sidebar from '@/components/LayoutRendering/Sidebar'
    import Switcher from '@/components/LayoutRendering/Switcher'
    import DashboardOperations from '@/helpers/DashboardOperations'
    import {runDashboardOperations} from '@/services/dashboardService'
    import NormalView from '@/components/LayoutRendering/Types/NormalView'
    import TabbedView from '@/components/LayoutRendering/Types/TabbedView'
    import TemplatesCategory from '@/components/Widgets/TemplatesCategory'
    import {dashboardOperation, widgetGroupModel} from '@/models/instances'
    import ManageDashboardButtons from '@/components/ManageDashboardButtons'
    import ReorderLayoutDialog from '@/components/Common/ReorderLayoutDialog'
    import {createNewWidgets, removeDummyWidgets} from '@/services/widgetService'
    import EventBus from "@/event-bus/EventBus";
    import {ListIcon} from 'vue-feather-icons'

    export default {
        components: {
            ManageDashboardButtons,
            [Switcher.name]: Switcher,
            NewGroupButton,
            AddButton,
            WidgetMenu,
            EventsSDK,
            NormalView,
            TabbedView,
            Sidebar,
            TemplatesCategory,
            ReorderLayoutDialog,
            [Tooltip.name]: Tooltip,
            ListIcon,
        },
        mixins: [pageSizeMixin],
        data() {
            return {
                showWidgetMenu: false,
                editMode: false,
                activeDashboardData: null,
                layoutTypes: {
                    [layoutTypes.NORMAL]: 'NormalView',
                    [layoutTypes.TABBED]: 'TabbedView',
                },
                layoutType: 'tabbed',
                previousLayoutType: '',
                operations: new DashboardOperations(),
                activeTab: '',
                showReorderDataDialog: false,
            }
        },
        computed: {
            loading() {
                return this.$store.state.dashboards.loadingData;
            },
            dashboard() {
                return this.$store.state.dashboards.activeDashboard
            },
            allWidgetTemplates() {
                return this.$store.state.widgetTemplate.allWidgetTemplates
            },
            getClass() {
                if (this.layoutType === layoutTypes.TABBED) {
                    return 'pt-40'
                }
            },
            showSidebar() {
                if (this.layoutType === layoutTypes.TABBED) {
                    return true
                }
            },
            token() {
                return this.$store.state.users.tokenString
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
            queues() {
                return this.$store.state.queues.all
            },
            firstWidgetGroup() {
                return this.activeDashboardData.WidgetGroupList[0]
            },
            activeWidgetGroupID() {
                return get(this.$store.state.dashboards.activeDashboard, 'WidgetGroupList[0].WidgetGroupID')
            }
        },
        methods: {
            async addWidgetsToGroup(data = {}) {
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
            },
            moveWidgetGroup(widgetGroup, direction) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                let newIndex = index;
                if (direction === 'up') {
                    newIndex = index - 1;
                } else {
                    newIndex = index + 1;
                }

                if (newIndex < 0) {
                    //move first down
                    let selectedGroup = this.activeDashboardData.WidgetGroupList[0];
                    this.activeDashboardData.WidgetGroupList.splice(0, 1)
                    this.activeDashboardData.WidgetGroupList.push(selectedGroup)
                    this.activeDashboardData.WidgetGroupList.forEach((group, index) => {
                        group.Order = index
                    })
                } else if (newIndex >= this.activeDashboardData.WidgetGroupList.length) {
                    //move last up
                    let newPosition = this.activeDashboardData.WidgetGroupList.length - 1;
                    let selectedGroup = this.activeDashboardData.WidgetGroupList[newPosition];
                    this.activeDashboardData.WidgetGroupList.splice(newPosition, 1)
                    this.activeDashboardData.WidgetGroupList.splice(0, 0, selectedGroup)
                    this.activeDashboardData.WidgetGroupList.forEach((group, index) => {
                        group.Order = index
                    })
                } else {
                    let originWidget = this.activeDashboardData.WidgetGroupList[index];
                    let destinationWidget = this.activeDashboardData.WidgetGroupList[newIndex];
                    originWidget.Order = newIndex
                    destinationWidget.Order = index
                    this.activeDashboardData.WidgetGroupList.splice(newIndex, 1, originWidget)
                    this.activeDashboardData.WidgetGroupList.splice(index, 1, destinationWidget)
                }
            },
            reorderWidgetGroup(data = {}) {
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
            //Order list & add to List - events
            async onListChange(event, widgetGroup) {
                if (event[draggableEvents.MOVED]) {
                    event = event[draggableEvents.MOVED]
                    if (!widgetGroup.IsNew) {
                        widgetGroup.WidgetList.splice(event.newIndex, 0, widgetGroup.WidgetList.splice(event.oldIndex, 1)[0]);
                        widgetGroup.WidgetList.forEach((widget, index) => {
                            if (!widget.WidgetLayout) {
                                widget.WidgetLayout = {
                                    Order: index + 1
                                }
                            } else {
                                widget.WidgetLayout.Order = index + 1
                            }
                            this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                        })
                    }
                } else {
                    event = event[draggableEvents.ADDED]

                    let newWidget = await createNewWidgets([event.element], widgetGroup, event.newIndex)
                    widgetGroup.WidgetList.splice(event.newIndex, 0, newWidget[0])

                    let widgetsToUpdate = widgetGroup.WidgetList.slice(event.newIndex + 1)
                    widgetsToUpdate.forEach((widget, index) => {
                        widget.WidgetLayout.Order = index + 1 + event.newIndex
                        this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                    })
                }
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    this.activeDashboardData.WidgetGroupList.splice(index, 1, widgetGroup)
                }
            },
            onWidgetMenuClickOutside() {
                this.showWidgetMenu = false
            },
            removeWidget(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.WidgetID === widget.WidgetID)
                    if (widgetIndex !== -1) {
                        this.activeDashboardData.WidgetGroupList[index].WidgetList.splice(widgetIndex, 1)
                        if (!widgetGroup.IsNew) {
                            this.operations.add(dashboardOperation(types.REMOVE, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                        } else {
                            removeDummyWidgets([widget.WidgetID])
                        }
                    }
                }
            },
            removeWidgetGroup(widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    this.activeDashboardData.WidgetGroupList.splice(index, 1)
                    if (!widgetGroup.IsNew) {
                        this.operations.removeGroup(dashboardOperation(types.REMOVE, targets.WIDGET_GROUP, widgetGroup))
                    }
                    let widgetIds = map(widgetGroup.WidgetList, 'WidgetID')
                    removeDummyWidgets(widgetIds)
                }
            },
            addNewGroup() {
                this.activeDashboardData.WidgetGroupList.splice(0, 0, widgetGroupModel())
                this.activeDashboardData.WidgetGroupList.forEach((group, index) => {
                    group.Order = index
                })
            },
            updateWidget(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.WidgetID === widget.WidgetID)
                    if (widgetIndex !== -1 && !widgetGroup.IsNew) {
                        this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET, widget, widgetGroup.WidgetGroupID))

                        this.activeDashboardData.WidgetGroupList[index].WidgetList.splice(widgetIndex, 1, widget)

                        if (!this.editMode) {
                            this.saveDashboard()
                        }
                    }
                }
            },
            async saveDashboard() {
                this.showWidgetMenu = false
                //CheckWidgetGroupUpdates
                this.updateDashboardOperations()
                //RunDashboardOperations
                let dashboard = await runDashboardOperations(this.operations, this.activeDashboardData)
                await this.$store.dispatch('dashboards/updateDashboard', dashboard)
                this.operations = new DashboardOperations()
            },
            updateDashboardOperations() {
                let oldDashboardWidgetGroupList = this.$store.state.dashboards.activeDashboard.WidgetGroupList
                //Check if some widgetGroups are updated and add changes to dashboard operations
                let widgetGroupsToUpdate = differenceBy(this.activeDashboardData.WidgetGroupList, oldDashboardWidgetGroupList, 'WidgetGroupTitle')
                //Check if the widgetsGroups are changed order
                this.activeDashboardData.WidgetGroupList.forEach((group, index) => {
                    if (oldDashboardWidgetGroupList[index] && group.WidgetGroupID !== oldDashboardWidgetGroupList[index].WidgetGroupID) {
                        widgetGroupsToUpdate.push(group)
                    }
                })
                //Exclude additional operations duplicate(title updates)
                widgetGroupsToUpdate = uniqBy(widgetGroupsToUpdate, "WidgetGroupID")
                widgetGroupsToUpdate.forEach((widgetGroup) => {
                    this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET_GROUP, widgetGroup))
                })

            },
            resetDashboard() {
                this.showWidgetMenu = false
                let dashboard = this.$store.state.dashboards.activeDashboard
                this.$store.dispatch('dashboards/updateDashboard', dashboard)
                this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
                this.operations = new DashboardOperations()
            },
            switchDashboardLayout(type) {
                // TODO: update dashboard generalSettings
                this.layoutType = type
            },
            switchTab(tab) {
                this.activeTab = tab
            },
            onNewEvent(eventData) {
                let {name, data} = eventData
                switch (name) {
                    case sdkEventTypes.ALL_EXTENSION_STATUS:
                        this.$store.dispatch('extensions/setExtensions', data.extensions)
                        break;
                    case sdkEventTypes.EXTENSION_EVENT:
                        let extension = data.data
                        // Event reason: NEWCALL/ANSWER/HANGUP
                        extension['lastEvent'] = {
                            reason: data.reason,
                            ivrid: data.ivruniqueid
                        }
                        let index = this.extensions.findIndex(e => e.userID === extension.userID)
                        if (index !== -1) {
                            this.$store.dispatch('extensions/updateExtension', {index, extension})
                        }
                        break;
                    case sdkEventTypes.LOGIN:
                        this.$store.dispatch('queues/setQueues', data.queues)
                        break;
                    case sdkEventTypes.QUEUE_EVENT:
                        let queue = data.data
                        let _index = this.queues.findIndex(e => e.QueueID === queue.QueueID)
                        if (_index !== -1) {
                            this.$store.dispatch('queues/updateQueue', {_index, queue})
                        }
                        break;
                    case sdkEventTypes.CONNECT_ERROR:
                        EventBus.$emit(sdkEventTypes.CONNECT_ERROR)
                        break;
                    case sdkEventTypes.CONNECT_TIMEOUT:
                        EventBus.$emit(sdkEventTypes.CONNECT_TIMEOUT)
                        break;
                    default:
                        break;
                }
            },
            sortDashboardEntities(dashboard) {
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
        },
        watch: {
            dashboard: {
                immediate: true,
                handler: function () {
                    let dashboard = cloneDeep(this.$store.state.dashboards.activeDashboard)
                    this.sortDashboardEntities(dashboard)
                }
            },
            editMode(val) {
                if (val) {
                    this.previousLayoutType = this.layoutType
                    this.layoutType = layoutTypes.NORMAL
                } else {
                    this.layoutType = this.previousLayoutType
                }
            },
            activeWidgetGroupID: {
                immediate: true,
                handler(newVal) {
                    this.activeTab = newVal
                }
            }
        },
        async created() {
            try {
                const config = {
                    token: this.token,
                }
                if (process.env.VUE_APP_EVENTS_SDK_URL) {
                    config.url = process.env.VUE_APP_EVENTS_SDK_URL
                }
                if (process.env.VUE_APP_EVENTS_SDK_SERVERS) {
                    config.servers = process.env.VUE_APP_EVENTS_SDK_SERVERS
                }
                this.sdk = new EventsSDK(config)
                await this.sdk.init()
                this.sdk.on('*', this.onNewEvent)
                await this.sdk.login()
            } catch (e) {
                parseCatch(e, true)
            }
        }
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
