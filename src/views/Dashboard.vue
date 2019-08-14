<template>
    <div class="pt-24">
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
            <div :key="activeDashboardData.ID">
                <transition-group name="flip-list">
                    <div v-for="widgetGroup in activeDashboardData.WidgetGroupList" :key="widgetGroup.ID" class="my-10"
                         :class="{'editable-widgets':editMode}">
                        <div v-if="editMode" class="flex items-center justify-between mb-8">
                            <base-input v-model="widgetGroup.Title"></base-input>
                            <edit-group-buttons @remove-group="removeWidgetGroup(widgetGroup)"
                                                @move-up="orderWidgetGroup(widgetGroup, 'up')"
                                                @move-down="orderWidgetGroup(widgetGroup, 'down')">
                            </edit-group-buttons>
                        </div>
                        <h3 v-else class="font-semibold text-2xl text-gray-800">{{widgetGroup.Title}}</h3>
                        <widget-list
                                :widgets="widgetGroup.WidgetList"
                                :all-widgets="allWidgets"
                                :editable="editMode"
                                :widget-group="widgetGroup"
                                @onListChange="(data) => onListChange(data.list, data.group)"
                                @addWidgetToGroup="(data) => addWidgetToGroup(data.widget, data.group)"
                                @removeWidget="(data) => removeWidget(data.widget, data.group)"
                                @updateWidget="(data) => updateWidget(data.widget, data.group)">
                        </widget-list>
                    </div>
                </transition-group>
            </div>
        </fade-transition>
    </div>
</template>

<script>
    import AddButton from '@/components/AddButton'
    import EditButton from "@/components/EditButton";
    import EditGroupButtons from '@/components/EditGroupButtons'
    import {Trash2Icon} from 'vue-feather-icons'
    import cloneDeep from 'lodash/cloneDeep'
    import NewGroupButton from "@/components/NewGroupButton"
    import BaseInput from "@/components/BaseInput"
    import WidgetMenu from '@/components/Widgets/WidgetMenu'
    import WidgetList from '@/components/Widgets/WidgetList'

    export default {
        components: {
            BaseInput,
            NewGroupButton,
            EditGroupButtons,
            Trash2Icon,
            EditButton,
            AddButton,
            WidgetMenu,
            WidgetList
        },
        data() {
            return {
                showWidgetMenu: false,
                editMode: false,
                activeDashboardData: cloneDeep(this.$store.state.dashboards.activeDashboard),
            }
        },
        computed: {
            dashboard() {
                return this.$store.state.dashboards.activeDashboard
            },
            allWidgets() {
                return this.$store.state.widgets.allWidgets
            },
        },
        methods: {
            addWidgetToGroup(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
                this.activeDashboardData.WidgetGroupList[index].WidgetList.push(widget);
            },
            orderWidgetGroup(widgetGroup, direction) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
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
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
                if (index !== -1) {
                    this.activeDashboardData.WidgetGroupList.splice(index, 1, newWidgetGroup)
                }
            },
            onWidgetMenuClickOutside() {
                this.showWidgetMenu = false
            },
            removeWidget(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
                if (index !== -1) {
                    let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.WidgetID === widget.WidgetID)
                    if (widgetIndex !== -1) {
                        this.activeDashboardData.WidgetGroupList[index].WidgetList.splice(widgetIndex, 1)
                    }
                }
            },
            removeWidgetGroup(widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
                if (index !== -1) {
                    this.activeDashboardData.WidgetGroupList.splice(index, 1)
                }
            },
            addNewGroup() {
                let widget = {
                    "ID": Math.random() * 100,
                    "Title": "",
                    "WidgetList": []
                }
                this.activeDashboardData.WidgetGroupList.splice(0, 0, widget)
            },
            updateWidget(widget, widgetGroup) {
                let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
                if (index !== -1) {
                    let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.ID === widget.ID)
                    if (widgetIndex !== -1) {
                        this.activeDashboardData.WidgetGroupList[index] = widget
                        this.saveDashboard()
                    }
                }
            },
            saveDashboard() {
                let dashboard = this.activeDashboardData
                this.$store.dispatch('dashboards/updateDashboard', {dashboard})
            },
            resetDashboard() {
                let dashboard = this.$store.state.dashboards.activeDashboard
                this.$store.dispatch('dashboards/updateDashboard', {dashboard})
                this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
            }
        },
        watch: {
            dashboard() {
                this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
            }
        }
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

    .el-button--primary {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }

</style>
