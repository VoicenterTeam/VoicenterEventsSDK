<template>
    <div class="pt-24" v-if="activeDashboardData">
        <div class="flex justify-end">
            <layout-switcher
                :activeType="layoutType"
                :editMode="editMode"
                @switch-layout="(type) => switchDashboardLayout(type)">
            </layout-switcher>
        </div>
        <div class="flex justify-end relative my-4 -mx-1">
            <AddButton v-if="editMode" class="mx-1" @click.stop="showWidgetMenu = !showWidgetMenu"></AddButton>
            <EditButton
                @click.stop="editMode = !editMode"
                @reset-dashboard="resetDashboard"
                @save-dashboard="saveDashboard"
                :edit-mode="editMode">
            </EditButton>
            <fade-transition>
                <WidgetMenu v-if="showWidgetMenu"
                            v-click-outside="onWidgetMenuClickOutside"
                            :widgets="allWidgets">
                </WidgetMenu>
            </fade-transition>
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
                :allWidgets="allWidgets"
                @remove-group="(widgetGroup) => removeWidgetGroup(widgetGroup)"
                @order-groups="(data) => orderWidgetGroup(data.widgetGroup, data.direction)"
                @onListChange="(data) => onListChange(data.list, data.group)"
                @addWidgetToGroup="(data) => addWidgetToGroup(data.widget, data.group)"
                @removeWidget="(data) => removeWidget(data.widget, data.group)"
                @updateWidget="(data) => updateWidget(data.widget, data.group)">
            </component>
        </fade-transition>
    </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    import layoutTypes from '@/enum/layoutTypes'
    import AddButton from '@/components/AddButton'
    import EditButton from '@/components/EditButton'
    import NewGroupButton from '@/components/NewGroupButton'
    import WidgetMenu from '@/components/Widgets/WidgetMenu'
    import Switcher from '@/components/LayoutRendering/Switcher'
    import NormalView from '@/components/LayoutRendering/Types/NormalView'
    import TabbedView from '@/components/LayoutRendering/Types/TabbedView'

    export default {
        components: {
            NewGroupButton,
            EditButton,
            AddButton,
            WidgetMenu,
            [Switcher.name]: Switcher,
            NormalView,
            TabbedView
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
                previousLayoutType: ''
            }
        },
        computed: {
            dashboard() {
                return this.$store.state.dashboards.activeDashboard
            },
            allWidgets() {
                return this.$store.state.widgets.allWidgets
            }
        },
        methods: {
            addWidgetToGroup(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                this.activeDashboardData.WidgetGroupList[index].WidgetList.push(widget);
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
            onListChange(widgets, widgetGroup) {
                let newWidgetGroup = {
                    ...widgetGroup,
                    WidgetList: widgets
                }
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    this.activeDashboardData.WidgetGroupList.splice(index, 1, newWidgetGroup)
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
                    }
                }
            },
            removeWidgetGroup(widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    this.activeDashboardData.WidgetGroupList.splice(index, 1)
                }
            },
            addNewGroup() {
                let widget = {
                    "WidgetGroupID": Math.random() * 100,
                    "WidgetGroupTitle": "",
                    "WidgetList": []
                }
                this.activeDashboardData.WidgetGroupList.splice(0, 0, widget)
            },
            updateWidget(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
                if (index !== -1) {
                    let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.WidgetID === widget.WidgetID)
                    if (widgetIndex !== -1) {
                        this.activeDashboardData.WidgetGroupList[index].WidgetList[widgetIndex] = widget
                        this.saveDashboard()
                    }
                }
            },
            saveDashboard() {
                let dashboard = this.activeDashboardData
                this.$store.dispatch('dashboards/updateDashboard', dashboard)
            },
            resetDashboard() {
                let dashboard = this.$store.state.dashboards.activeDashboard
                this.$store.dispatch('dashboards/updateDashboard', dashboard)
                this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
            },
            switchDashboardLayout(type) {
                // TODO: update dashboard generalSettings
                this.layoutType = type
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
    }
</script>
<style>
    .editable-widgets {
        @apply bg-gray-100 rounded-lg;
        border-radius: 10px;
        min-width: 460px;
        @apply p-8;
        @apply shadow;
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

</style>
