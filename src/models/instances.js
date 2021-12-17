import store from '../store/store'

export const dashboardModel = () => {
    return {
        AccountID: store.state.entities.selectedAccountID,
        DashboardTitle: '',
        DashboardLayoutID: '',
        WidgetGroupList: [],
        DashboardLayout: {
        }
    }
}

export const widgetGroupModel = {
    Order: 0,
    WidgetGroupID: Math.random() * 100,
    WidgetGroupTitle: '',
    WidgetList: [],
    IsNew: true
}

export const dashboardOperation = (type, target, payload, parentID = null, temporaryID = false) => ({
    type: type,
    target: target,
    payload: payload,
    meta: {
        parentID: parentID,
        temporaryID: temporaryID
    }
})

export const widgetModel = (TemplateID, Title, WidgetGroupID, DashboardID, WidgetLayout) => ({
    Title: Title,
    TemplateID: TemplateID,
    WidgetGroupID: WidgetGroupID,
    DashboardID: DashboardID,
    WidgetLayout: WidgetLayout
})
