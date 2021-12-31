import { WidgetApi } from '@/api/widgetApi'
import { DashboardApi } from '@/api/dashboardApi'
import { types, targets } from '@/enum/operations'
import { WidgetGroupsApi } from '@/api/widgetGroupApi'
import store from '@/store/store'
import { Notification } from 'element-ui'
import i18n from '@/i18n'

export async function runDashboardOperations(operations, dashboard, clonedDashboard) {
    if (operations.all().length) {
        try {
            let dashboardID = dashboard.DashboardID
            const operationsUpdateWidgetsGroup = getAllWidgetGroupsNeedToUpdate(operations)
            const operationsUpdateWidgetPosition = getAllWidgetsPositionNeedToUpdate(operations)
            const updateWidgetsGroupTitle = getAllWidgetGroupsTitleNeedToUpdate(operations, clonedDashboard)
            const allOperationsWithoutUpdate = operations
                .all()
                .filter(el => el.type !== 'update')

            for (const operation of allOperationsWithoutUpdate) {
                switch (operation.target) {
                    case targets.WIDGET_GROUP:
                        switch (operation.type) {
                            case types.ADD:
                                delete operation.payload.IsNew
                                const { WidgetGroupID } = await WidgetGroupsApi.store(operation.payload)
                                await DashboardApi.addWidgetGroup(dashboardID, WidgetGroupID)
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

            if (operationsUpdateWidgetsGroup.length) {
                await WidgetGroupsApi.reorder(operationsUpdateWidgetsGroup)
            }
            if (operationsUpdateWidgetPosition.length) {
                await WidgetApi.updatePosition(operationsUpdateWidgetPosition)
            }
            if (updateWidgetsGroupTitle && Object.keys(updateWidgetsGroupTitle).length) {
                await WidgetGroupsApi.update(updateWidgetsGroupTitle, true)
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

function getAllWidgetGroupsNeedToUpdate(operations) {
    return operations
        .all()
        .filter(el => el.type === 'update' && el.target === 'WidgetGroup')
        .map(el => {
            return {
                WidgetGroupID: el.payload.WidgetGroupID,
                Order: el.payload.Order 
            }
        })
}

function getAllWidgetsPositionNeedToUpdate(operations) {
    return  operations
        .all()
        .filter(el => (el.type === 'update' || el.type === 'moved') && el.target === 'Widget')
        .map(el => {
            return { 
                WidgetID: el.payload.WidgetID,
                GridLayout: el.payload.WidgetLayout.GridLayout
            }
        })
}

function getAllWidgetGroupsTitleNeedToUpdate (operations, clonedDashboard) {
    let updateWidgetsGroup = {}
    const operationsWithWidgetGroupsTitleId = operations
        .all()
        .filter(el => el.type === 'update' && el.target === 'WidgetGroup')
        .map(el => {
            return {
                WidgetGroupID: el.payload.WidgetGroupID,
                WidgetGroupTitle: el.payload.WidgetGroupTitle 
            }
        })
    clonedDashboard.WidgetGroupList
        .forEach(clonedEl => {
            const sameElement = operationsWithWidgetGroupsTitleId.find(el => +el.WidgetGroupID === +clonedEl.WidgetGroupID && el.WidgetGroupTitle !== clonedEl.WidgetGroupTitle)
            if (sameElement && Object.keys(sameElement).length) {
                updateWidgetsGroup = {
                    WidgetsGroupID: sameElement.WidgetGroupID,
                    WidgetsGroupTitle: sameElement.WidgetGroupTitle
                }
            }
        })

    return  updateWidgetsGroup
}
