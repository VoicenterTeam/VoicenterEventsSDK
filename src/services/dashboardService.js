import { WidgetApi } from '@/api/widgetApi'
import { DashboardApi } from '@/api/dashboardApi'
import { types, targets } from '@/enum/operations'
import { WidgetGroupsApi } from '@/api/widgetGroupApi'
import store from '@/store/store'
import { Notification } from 'element-ui'
import i18n from '@/i18n'

export async function runDashboardOperations(operations, dashboard) {
    if (operations.all().length) {
        try {
            let dashboardID = dashboard.DashboardID
            for (const operation of operations.all()) {
                switch (operation.target) {
                    case targets.WIDGET_GROUP:
                        switch (operation.type) {
                            case types.ADD:
                                delete operation.payload.IsNew
                                const { WidgetGroupID } = await WidgetGroupsApi.store(operation.payload)
                                await DashboardApi.addWidgetGroup(dashboardID, WidgetGroupID)
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
                            case types.MOVED_IN:
                                await WidgetGroupsApi.addWidget(operation.meta.parentID, operation.payload.WidgetID)
                                break;
                            case types.ADD:
                                await WidgetGroupsApi.addWidget(operation.meta.parentID, operation.payload.WidgetID)
                                break;
                            case types.MOVED:
                            case types.UPDATE:
                                await WidgetApi.update(operation.payload)
                                break;
                            case types.MOVED_OUT:
                            case types.REMOVE:
                                await WidgetApi.destroy(operation.payload.WidgetID)
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
        } catch (e) {
            Notification.error({
                title: i18n.t('Something went wrong.'),
                message: i18n.t('Please refresh page and try again.'),
            })
            store.dispatch('dashboards/setLoadingData', false)
        }
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
