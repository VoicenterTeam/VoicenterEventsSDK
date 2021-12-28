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
            this.loading = true
            let { widgets: widgetTemplates, group } = data
            let widgetGroup = {
                ...group,
                DashboardID: this.activeDashboardData.DashboardID
            }

            let createdWidgets = await createNewWidgets(widgetTemplates, widgetGroup)

            let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)

            this.activeDashboardData.WidgetGroupList[index].WidgetList = this.activeDashboardData.WidgetGroupList[index].WidgetList.concat(createdWidgets)
            this.groupToEdit = this.activeDashboardData.WidgetGroupList[index]

            createdWidgets.forEach(({WidgetID}) => {
                this.temporaryWidgetIds.push(WidgetID)
            })

            bus.$emit('added-widgets', createdWidgets)
            this.loading = false
        },
        async duplicateWidget(widget) {
            this.loading = true

            const widgetGroup = { ...this.groupToEdit }
            const index = widgetGroup.WidgetList.findIndex(w => w.WidgetID.toString() === widget.WidgetID.toString())

            if (index === -1) {
                this.loading = false
                return
            }

            let newWidget = cloneDeep(widget)
            newWidget.WidgetEntity = []
            newWidget.DashboardID = this.dashboard.DashboardID
            newWidget.WidgetGroupID = this.groupToEdit.WidgetGroupID
            const yPosition = widget.WidgetLayout.GridLayout.y || 2
            newWidget.WidgetLayout.GridLayout.y += yPosition

            const {Data} = await WidgetApi.store(newWidget)

            if (!Data) {
                return
            }

            const {WidgetData} = await WidgetApi.find(Data.WidgetID)
            this.temporaryWidgetIds.push(WidgetData.WidgetID)

            widgetGroup.WidgetList.push(WidgetData)

            this.groupToEdit = widgetGroup
            bus.$emit('added-widgets', [WidgetData])

            this.editMode = false
            this.$nextTick(() => {
                this.editMode = true
            })

            this.loading = false
        },
        addNewGroup() {
            const group = { ...widgetGroupModel() }

            this.activeDashboardData.WidgetGroupList.splice(0, 0, group)
            this.activeDashboardData.WidgetGroupList.forEach((group, index) => {
                group.Order = index
            })

            this.editMode = false

            this.$nextTick(() => {
                this.editMode = true
                this.groupToEdit = group
                this.switchTab(group.WidgetGroupID)
            })
        },
    },
}
