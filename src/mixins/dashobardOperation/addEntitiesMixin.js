import { cloneDeep } from 'lodash'
import bus from '@/event-bus/EventBus'
import { WidgetApi } from '@/api/widgetApi'
import { targets, types } from '@/enum/operations'
import { createNewWidgets } from '@/services/widgetService'
import { dashboardOperation, widgetGroupModel } from '@/models/instances'

export default {
    data() {
        return {
            temporaryWidgetIds: [],
        }
    },
    methods: {
        async addWidgetsToGroup(data = {}) {
            this.storingData = true
            let { widgets: widgetTemplates } = data
            let widgetGroup = { ...this.groupToEdit }
            
            let createdWidgets = await createNewWidgets(widgetTemplates, widgetGroup)
            
            let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
            
            if (!widgetGroup.IsNew) {
                for (let widget of createdWidgets) {
                    this.operations.add(dashboardOperation(types.ADD, targets.WIDGET, widget, widgetGroup.WidgetGroupID))
                }
            }
            
            this.activeDashboardData.WidgetGroupList[index].WidgetList = this.activeDashboardData.WidgetGroupList[index].WidgetList.concat(createdWidgets)
            this.groupToEdit = this.activeDashboardData.WidgetGroupList[index]
            
            bus.$emit('added-widgets', createdWidgets)
            this.storingData = false
        },
        async duplicateWidget(widget) {
            this.storingData = true
            
            const widgetGroup = { ...this.groupToEdit }
            const index = widgetGroup.WidgetList.findIndex(w => w.WidgetID.toString() === widget.WidgetID.toString())
            
            if (index === -1) {
                this.storingData = false
                return
            }
            
            let newWidget = cloneDeep(widget)
            newWidget.WidgetEntity = []
            
            const yPosition = widget.WidgetLayout.GridLayout.y || 2
            newWidget.WidgetLayout.GridLayout.y += yPosition
            
            const duplicatedWidget = await WidgetApi.store(newWidget)
            
            this.temporaryWidgetIds.push(duplicatedWidget.WidgetID)
            
            this.operations.add(dashboardOperation(types.ADD, targets.WIDGET, duplicatedWidget, widgetGroup.WidgetGroupID))
            
            widgetGroup.WidgetList.splice(widgetGroup.WidgetList.length, 0, duplicatedWidget)
            
            this.groupToEdit = widgetGroup
            this.storingData = false
        },
        addNewGroup() {
            const group = { ...widgetGroupModel }
            
            this.activeDashboardData.WidgetGroupList.splice(0, 0, group)
            this.activeDashboardData.WidgetGroupList.forEach((group, index) => {
                group.Order = index
            })
            
            this.editMode = false
            
            this.$nextTick(() => {
                this.editMode = true
                this.groupToEdit = group
            })
        },
    },
}
