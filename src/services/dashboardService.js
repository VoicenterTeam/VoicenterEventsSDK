import {WidgetApi} from '@/api/widgetApi'
import {DashboardApi} from '@/api/dashboardApi'
import {types, targets} from '@/enum/operations'
import {WidgetGroupsApi} from '@/api/widgetGroupApi'

export async function runDashboardOperations(operations, dashboard) {
    if (operations.all().length) {
        let dashboardID = dashboard.DashboardID
        for (const operation of operations.all()) {
            switch (operation.target) {
                case targets.WIDGET_GROUP:
                    switch (operation.type) {
                        case types.ADD:
                            delete operation.payload.IsNew
                            let newGroup = await WidgetGroupsApi.store(operation.payload)
                            await DashboardApi.addWidgetGroup(dashboardID, newGroup.WidgetGroupID)
                            break;
                        case types.UPDATE:
                            await WidgetGroupsApi.update(operation.payload)
                            break;
                        case types.REMOVE:
                            await DashboardApi.removeWidgetGroup(dashboardID, operation.payload.WidgetGroupID)
                            break;
                        default:
                            break;
                    }
                    break;
                case targets.WIDGET:
                    switch (operation.type) {
                        case types.ADD:
                            await WidgetGroupsApi.addWidget(operation.meta.parentID, operation.payload.ID)
                            break;
                        case types.UPDATE:
                            await WidgetApi.update(operation.payload)
                            break;
                        case types.REMOVE:
                            await WidgetGroupsApi.removeWidget(operation.meta.parentID, operation.payload.WidgetID)
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        }
        return getDashboard(dashboardID)
    }
    return dashboard
}

export async function updateDashboard(dashboard) {
    await DashboardApi.update(dashboard)
    return getDashboard(dashboard.DashboardID)
}

function getDashboard(dashboardID) {
    return DashboardApi.find(dashboardID)
}
