import get from 'lodash/get'
import store from '@/store/store'

export function getWidgetEndpoint(widget) {
    let getWidgetTemplate = store.getters['widgetTemplate/getWidgetTemplate']
    let endpoint = get(widget, 'WidgetLayout.Endpoint')
    if (!endpoint) {
        let widgetTemplate = getWidgetTemplate(widget.TemplateID)
        endpoint = get(widgetTemplate, 'Endpoint')
    }
    return endpoint.replace('{WidgetID}', widget.WidgetID)
}

export function getWidgetDataType(widget) {
    let getWidgetTemplate = store.getters['widgetTemplate/getWidgetTemplate']
    let dataType = get(widget, 'WidgetLayout.DataTypeID')
    if (!dataType) {
        let widgetTemplate = getWidgetTemplate(widget.TemplateID)
        dataType = get(widgetTemplate, 'DataType.ID')
    }
    return dataType
}

