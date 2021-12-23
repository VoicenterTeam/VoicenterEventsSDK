import isEqual from 'lodash/isEqual'
import { WidgetApi } from '@/api/widgetApi'
import { dashboardOperation } from '@/models/instances'
import { targets, types } from '@/enum/operations'

export default {
    methods: {
        async updateWidget(widget, widgetGroup) {
            let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID === widgetGroup.WidgetGroupID)
            if (index !== -1) {
                let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.WidgetID === widget.WidgetID)

                if (widgetIndex !== -1 && !widgetGroup.IsNew) {
                    this.$set(widget, 'onLoading', true)
                    await WidgetApi.update(widget)
                    this.$set(widget, 'onLoading', false)
                    let {WidgetData} = await WidgetApi.find(widget.WidgetID)
                    this.activeDashboardData.WidgetGroupList[index].WidgetList.splice(widgetIndex, 1, WidgetData)
                }
            }
        },
        updateGridStacks(group, grids) {
            const activeDashboardWidgets = group.WidgetList
            grids.forEach(grid => {
                grid.engine.nodes.forEach((node) => {
                    let widget = activeDashboardWidgets.find((widget) => Number(widget.WidgetID) === Number(node.id))
                    if (!widget) {
                        return
                    }
                    let nodeLayout = {
                        x: node.x,
                        y: node.y,
                        width: node.width,
                        height: node.height,
                    }
                    let widgetGridLayout = widget.WidgetLayout.GridLayout

                    if (isEqual(widgetGridLayout, nodeLayout)) {
                        return
                    }

                    widget.WidgetLayout.GridLayout = nodeLayout
                    this.operations.add(dashboardOperation(types.UPDATE, targets.WIDGET, widget, group.WidgetGroupID))
                })
            })
        },
        onReorderWidgetGroup(data = {}) {
            let { direction: direction, widgetGroup: widgetGroup } = data

            let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.WidgetGroupID.toString() === widgetGroup.WidgetGroupID.toString())
            let newIndex = index;

            if (direction === 'up') {
                newIndex = index - 1;
            } else if (direction === 'down') {
                newIndex = index + 1;
            }

            let originGroup = this.activeDashboardData.WidgetGroupList[index]
            let destinationGroup = this.activeDashboardData.WidgetGroupList[newIndex]

            if (newIndex < 0) {
                let selectedGroup = this.activeDashboardData.WidgetGroupList[0]
                this.activeDashboardData.WidgetGroupList.splice(0, 1)
                this.activeDashboardData.WidgetGroupList.push(selectedGroup)
            } else if (newIndex >= this.activeDashboardData.WidgetGroupList.length) {
                let newPosition = this.activeDashboardData.WidgetGroupList.length - 1
                let selectedGroup = this.activeDashboardData.WidgetGroupList[newPosition]
                this.activeDashboardData.WidgetGroupList.splice(newPosition, 1)
                this.activeDashboardData.WidgetGroupList.splice(0, 0, selectedGroup)
            } else {
                this.activeDashboardData.WidgetGroupList.splice(newIndex, 1, originGroup)
                this.activeDashboardData.WidgetGroupList.splice(index, 1, destinationGroup)
            }
        },
    },
}
