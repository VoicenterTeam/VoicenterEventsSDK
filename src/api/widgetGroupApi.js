import $axios from './apiConnection'
import parseCatch from '../helpers/handleErrors';

export const WidgetGroupsApi = {
    
    async update(data) {
        try {
            data.WidgetList.forEach(widget => {
                widget.WidgetConfig = widget.WidgetConfig.filter(config => config.ParameterID)
                if (!widget.WidgetTime) {
                    widget.WidgetTime = {}
                }
                if (!widget.WidgetConfig) {
                    widget.WidgetConfig = []
                }
                widget.WidgetConfig.forEach(config => {
                    if (config.WidgetParameterValue === '{}') {
                        config.WidgetParameterValue = ''
                    }
                })
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
            delete data.WidgetGroupID
            const { Data } = await $axios.post('/WidgetsGroups/Add/', data)
            return Data
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
    async reorder(data) {
        try {
            const widgetGroupList = {
                WidgetGroupList: data
            }
            return await $axios.post(`/WidgetsGroups/Reorder/`, widgetGroupList)
        } catch (e) {
            parseCatch(e, true, 'Reorder Widget Groups')
        }
    }
}
