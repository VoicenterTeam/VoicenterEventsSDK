import $axios from './apiConnection'
import parseCatch from "../helpers/handleErrors";

export const WidgetGroupsApi = {

    async update(data) {
        try {
            data.WidgetList.forEach(widget => {
                if (!widget.WidgetTime) {
                    widget.WidgetTime = {}
                }
            })
            if (data.Order === null) {
                data.Order = 0
            }
            return await $axios.post(`/WidgetsGroups/Update/`, data)
        } catch (e) {
            parseCatch(e, true, 'Update Widget Groups')
        }
    },

    async store(data) {
        try {
            return await $axios.post('/WidgetsGroups/Add/', data)
        } catch (e) {
            parseCatch(e, true, 'Add Widget Group')
        }
    },

    async addWidget(groupID, widgetID, data) {
        try {
            return await $axios.post(`/WidgetsGroups/AddWidget/${groupID}/${widgetID}`, data || {})
        } catch (e) {
            parseCatch(e, true, 'Add Widget to Widget Group')
        }
    },

    async removeWidget(groupID, widgetID) {
        try {
            return await $axios.post(`/WidgetsGroups/RemoveWidget/${groupID}/${widgetID}`)
        } catch (e) {
            parseCatch(e, true, 'Remove Widget from Widget Group')
        }
    },
}
