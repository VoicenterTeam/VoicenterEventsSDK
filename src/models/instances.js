export const dashboardModel = () => ({
    "AccountID": 1,
    "DashboardTitle": '',
    "WidgetGroupList": []
})

export const widgetGroupModel = () => ({
    "WidgetGroupID": Math.random() * 100,
    "WidgetGroupTitle": "",
    "WidgetList": [],
    "IsNew": true
})

export const dashboardOperation = (type, target, payload, parentID = null) => ({
    type: type,
    target: target,
    payload: payload,
    meta: {
        parentID: parentID
    }
})
