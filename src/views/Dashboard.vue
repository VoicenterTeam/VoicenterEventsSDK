<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)" class="dashboard">
        <div v-if="activeDashboardData">
            <sidebar v-if="showSidebar"
                     :activeTab="activeTab"
                     :widgetGroupList="activeDashboardData.WidgetGroupList"
                     @switch-tab="(tab) => switchTab(tab)"></sidebar>
            <div class="pt-24" :class="getClass">
                <div class="flex justify-end -mx-1">
                    <div class="my-4 flex">
                        <AddButton v-if="editMode" class="mx-1"
                                   @click.stop="showWidgetMenu = !showWidgetMenu"></AddButton>
                        <EditButton
                            @click.stop="editMode = !editMode"
                            @reset-dashboard="resetDashboard"
                            @save-dashboard="saveDashboard"
                            :edit-mode="editMode">
                        </EditButton>
                    </div>
                    <fade-transition>
                        <WidgetMenu v-if="showWidgetMenu"
                                    v-click-outside="onWidgetMenuClickOutside"
                                    :widgets="allWidgets">
                        </WidgetMenu>
                    </fade-transition>
                    <layout-switcher
                        v-if="!editMode"
                        :activeType="layoutType"
                        @switch-layout="(type) => switchDashboardLayout(type)">
                    </layout-switcher>
                </div>
                <div class="flex justify-end">
                    <new-group-button
                        @click.native="addNewGroup"
                        v-if="editMode">
                    </new-group-button>
                </div>
                <fade-transition mode="out-in" :duration="250">
                    <component
                        :is="layoutTypes[layoutType]"
                        :activeDashboardData="activeDashboardData"
                        :editMode="editMode"
                        :activeTab="activeTab"
                        :allWidgets="allWidgets"
                        @remove-group="(widgetGroup) => removeWidgetGroup(widgetGroup)"
                        @order-groups="(data) => orderWidgetGroup(data.widgetGroup, data.direction)"
                        @onListChange="(data) => onListChange(data.event, data.group)"
                        @addWidgetToGroup="(data) => addWidgetToGroup(data.widget, data.group)"
                        @removeWidget="(data) => removeWidget(data.widget, data.group)"
                        @updateWidget="(data) => updateWidget(data.widget, data.group)"
                        @switch-tab="(tab) => switchTab(tab)">
                    </component>
                </fade-transition>
            </div>
        </div>
    </div>
</template>

<script>

    import get from 'lodash/get';
    import cloneDeep from 'lodash/cloneDeep'
    import EventsSDK from 'voicenter-events-sdk'
    import differenceBy from 'lodash/differenceBy'
    import layoutTypes from '@/enum/layoutTypes'
    import AddButton from '@/components/AddButton'
    import parseCatch from '@/helpers/handleErrors'
    import {types, targets} from '@/enum/operations'
    import EditButton from '@/components/EditButton'
    import draggableEvents from '@/enum/draggableEvents'
    import NewGroupButton from '@/components/NewGroupButton'
    import WidgetMenu from '@/components/Widgets/WidgetMenu'
    import Sidebar from '@/components/LayoutRendering/Sidebar'
    import Switcher from '@/components/LayoutRendering/Switcher'
    import DashboardOperations from '@/helpers/DashboardOperations'
    import {runDashboardOperations} from '@/services/dashboardService'
    import NormalView from '@/components/LayoutRendering/Types/NormalView'
    import TabbedView from '@/components/LayoutRendering/Types/TabbedView'
    import {widgetGroupModel, dashboardOperation} from '@/models/instances'

    export default {
        components: {
            NewGroupButton,
            EditButton,
            AddButton,
            WidgetMenu,
            EventsSDK,
            [Switcher.name]: Switcher,
            NormalView,
            TabbedView,
            Sidebar
        },
        data() {
            return {
                showWidgetMenu: false,
                editMode: false,
                activeDashboardData: cloneDeep(this.$store.state.dashboards.activeDashboard),
                layoutTypes: {
                    [layoutTypes.NORMAL]: 'NormalView',
                    [layoutTypes.TABBED]: 'TabbedView',
                },
                layoutType: 'normal',
                previousLayoutType: '',
                activeTab: get(this.$store.state.dashboards.activeDashboard, 'WidgetGroupList[0].WidgetGroupID'),
                operations: new DashboardOperations()
            }
        },
        computed: {
            loading() {
                return this.$store.state.dashboards.loadingData;
            },
            dashboard() {
                return this.$store.state.dashboards.activeDashboard
            },
            allWidgets() {
                return this.$store.state.widgets.allWidgets
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
        },
        methods: {
            addWidgetToGroup(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                this.activeDashboardData.WidgetGroupList[index].WidgetList.push(widget);
                if (!widgetGroup.IsNew) {
                    this.operations.add(dashboardOperation(types.ADD, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                }
            },
            orderWidgetGroup(widgetGroup, direction) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                let newIndex = index;
                if (direction === 'up') {
                    newIndex = index - 1;
                } else {
                    newIndex = index + 1;
                }
                let originWidget = this.activeDashboardData.WidgetGroupList[index];
                let destinationWidget = this.activeDashboardData.WidgetGroupList[newIndex];

                if (newIndex < 0) {
                    let selectedGroup = this.activeDashboardData.WidgetGroupList[0];
                    this.activeDashboardData.WidgetGroupList.splice(0, 1)
                    this.activeDashboardData.WidgetGroupList.push(selectedGroup)

                } else if (newIndex >= this.activeDashboardData.WidgetGroupList.length) {
                    let newPosition = this.activeDashboardData.WidgetGroupList.length - 1;
                    let selectedGroup = this.activeDashboardData.WidgetGroupList[newPosition];
                    this.activeDashboardData.WidgetGroupList.splice(newPosition, 1)
                    this.activeDashboardData.WidgetGroupList.splice(0, 0, selectedGroup)

                } else {
                    this.activeDashboardData.WidgetGroupList.splice(newIndex, 1, originWidget)
                    this.activeDashboardData.WidgetGroupList.splice(index, 1, destinationWidget)
                }
            },
            //Order list & add to List - events
            onListChange(event, widgetGroup) {

                if (event[draggableEvents.MOVED]) {
                    event = event[draggableEvents.MOVED]
                    widgetGroup.WidgetList.splice(event.newIndex, 0, widgetGroup.WidgetList.splice(event.oldIndex, 1)[0]);
                    if (!widgetGroup.IsNew) {
                        widgetGroup.WidgetList.forEach((widget) => {
                            this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                        })
                    }
                } else {
                    event = event[draggableEvents.ADDED]
                    widgetGroup.WidgetList.splice(event.newIndex, 0, event.element);
                    if (!widgetGroup.IsNew) {
                        this.operations.add(dashboardOperation(types.ADD, targets.WIDGET, event.element, widgetGroup.WidgetGroupID))
                    }
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
                }
            },
            addNewGroup() {
                this.activeDashboardData.WidgetGroupList.splice(0, 0, widgetGroupModel())
            },
            updateWidget(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.WidgetID === widget.WidgetID)
                    if (widgetIndex !== -1) {
                        this.activeDashboardData.WidgetGroupList[index].WidgetList[widgetIndex] = widget
                        if (!widgetGroup.IsNew) {
                            this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                        }
                        if (!this.editMode) {
                            this.saveDashboard()
                        }
                    }
                }
            },
            async saveDashboard() {
                await this.$store.dispatch('dashboards/setLoadingData', true)

                let updatedWidgetGroups = differenceBy(this.activeDashboardData.WidgetGroupList, this.$store.state.dashboards.activeDashboard.WidgetGroupList, 'WidgetGroupTitle')
                updatedWidgetGroups.forEach((widgetGroup) => {
                    this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET_GROUP, widgetGroup))
                })

                let dashboard = await runDashboardOperations(this.operations, this.activeDashboardData)
                await this.$store.dispatch('dashboards/updateDashboard', dashboard)
                this.operations = new DashboardOperations()
            },
            resetDashboard() {
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
                if (name === 'AllExtensionsStatus') {
                    this.$store.dispatch('extensions/setExtensions', data.extensions)
                }
                if (name === 'ExtensionEvent') {
                    let extension = data.data
                    let index = this.extensions.findIndex(e => e.userID === extension.userID)
                    if (index !== -1) {
                        this.$store.dispatch('extensions/updateExtension', {index, extension})
                    }
                }
            }
        },
        watch: {
            dashboard() {
                this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
            },
            editMode(val) {
                if (val) {
                    this.previousLayoutType = this.layoutType
                    this.layoutType = layoutTypes.NORMAL
                } else {
                    this.layoutType = this.previousLayoutType
                }
            }
        },
        async created() {
            try {
                this.sdk = new EventsSDK({
                    token: this.token
                })
                await this.sdk.init()
                await this.sdk.login()
                this.sdk.on('*', this.onNewEvent)
            } catch (e) {
                parseCatch(e, true)
            }
        }
    }
</script>
<style>
    .editable-widgets {
        @apply bg-gray-100 rounded-lg;
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
        margin-left: -6rem;
    }

    .rtl .dashboard > .el-loading-mask > .el-loading-spinner {
        margin-left: 0;
        margin-right: -6rem;
    }

</style>
