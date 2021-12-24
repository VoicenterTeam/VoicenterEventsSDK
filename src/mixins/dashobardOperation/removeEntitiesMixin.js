import map from 'lodash/map'
import { dashboardOperation } from '@/models/instances'
import { removeDummyWidgets } from '@/services/widgetService'
import { cloneDeep } from 'lodash'
import DashboardOperations from '@/helpers/DashboardOperations'
import { targets, types } from '@/enum/operations'
import { DashboardApi } from '@/api/dashboardApi'

export default {
    data() {
        return {
            groupToRemove: null,
            showConfirmDialog: false,
        }
    },
    methods: {
        removeWidget(widget, widgetGroup) {
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
        tryRemoveWidgetGroup(widgetGroup) {
            this.groupToRemove = widgetGroup
            this.showConfirmDialog = true
        },
        async removeWidgetGroup() {
            this.showConfirmDialog = false
            let widgetGroup = this.groupToRemove
            let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
            
            if (index !== -1) {
                this.activeDashboardData.WidgetGroupList.splice(index, 1)
                let widgetIds = map(widgetGroup.WidgetList, 'WidgetID')
                removeDummyWidgets(widgetIds)
                if (!widgetGroup.IsNew) {
                    this.operations.removeGroup(dashboardOperation(types.REMOVE, targets.WIDGET_GROUP, widgetGroup))
                    await this.saveDashboard()
                }
            }
            
            this.groupToRemove = null
            this.editMode = false
        },
        resetDashboard() {
            this.editMode = false
            this.loading = true
            this.storingData = true
            
            removeDummyWidgets(this.temporaryWidgetIds)
            
            let dashboard = this.$store.state.dashboards.activeDashboard
            
            this.$store.dispatch('dashboards/updateDashboard', dashboard)
            this.activeDashboardData.WidgetGroupList.map(async widgetGroup => {
                if (widgetGroup.isNewGroup) {
                    if (widgetGroup.WidgetList && widgetGroup.WidgetList.length) {
                        const ids = widgetGroup.WidgetList.map(el => el.WidgetID)
                        removeDummyWidgets(ids)
                    }
                    DashboardApi.removeWidgetGroup(dashboard.DashboardID, widgetGroup.WidgetGroupID)
                }
                return widgetGroup
            })
            this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
            this.operations = new DashboardOperations()
            this.$nextTick(() => {
                this.storingData = false
                this.loading = false
            })
        },
    },
}
