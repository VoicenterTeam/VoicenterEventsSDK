import {settings} from '@/enum/defaultDashboardSettings'

export const dashboardModel = () => ({
    "AccountID": 1,
    "DashboardTitle": '',
    "WidgetGroupList": [],
    "DashboardLayout": {
        settings: settings
    }
})

export const widgetGroupModel = () => ({
    "Order": 0,
    "WidgetGroupID": Math.random() * 100,
    "WidgetGroupTitle": "",
    "WidgetList": [],
    "IsNew": true
})

export const dashboardOperation = (type, target, payload, parentID = null, temporaryID = false) => ({
    type: type,
    target: target,
    payload: payload,
    meta: {
        parentID: parentID,
        temporaryID: temporaryID
    }
})

export const widgetModel = (TemplateID, Title, WidgetLayout) => ({
    Title: Title,
    TemplateID: TemplateID,
    WidgetLayout: WidgetLayout
})
