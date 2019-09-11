import $axios from './apiConnection'
import parseCatch from "../helpers/handleErrors";

export const WidgetGroupsApi = {

    find(id) {
        // return $axios.get(`/WidgetGroups/Get/{$id}`)
    },

    async update(data) {
        try {
            return await $axios.post(`/WidgetsGroups/Update/`, data)
        } catch (e) {
            parseCatch(e, true)
        }
    },

    async store(data) {
        try {
            return await $axios.post('/WidgetsGroups/Add/', data)
        } catch (e) {
            parseCatch(e, true)
        }
    },

    async addWidget(groupID, widgetID) {
        try {
            return await $axios.post(`/WidgetsGroups/AddWidget/${groupID}/${widgetID}`)
        } catch (e) {
            parseCatch(e, true)
        }
    },

    async removeWidget(groupID, widgetID) {
        try {
            return await $axios.post(`/WidgetsGroups/RemoveWidget/${groupID}/${widgetID}`)
        } catch (e) {
            parseCatch(e, true)
        }
    },
}
