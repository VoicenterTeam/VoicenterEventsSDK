import get from 'lodash/get'
import store from '@/store/store'
import widgetDataTypes from '../enum/widgetDataTypes'

export function getWidgetEndpoint(widget) {
    let endpoint = get(widget, 'WidgetLayout.Endpoint')
    if (!endpoint) {
        let widgetTemplate = getWidgetTemplate(widget)
        endpoint = get(widgetTemplate, 'Endpoint', '')
    }
    return endpoint.replace('{WidgetID}', widget.WidgetID)
}

export function getWidgetDataType(widget) {
    let dataType = get(widget, 'WidgetLayout.DataTypeID')
    if (!dataType) {
        let widgetTemplate = getWidgetTemplate(widget)
        dataType = get(widgetTemplate, 'DataType.DataTypeID')
    }
    return dataType
}

export function getWidgetTemplate(widget) {
    let getWidgetTemplate = store.getters['widgetTemplate/getWidgetTemplate']
    return getWidgetTemplate(widget.TemplateID)
}

export const componentWidth = {
    [widgetDataTypes.LINES_TYPE_ID]: 'lg:w-3/3',
    [widgetDataTypes.BARS_WITH_LINES_TYPE_ID]: 'lg:w-3/3',
    [widgetDataTypes.TIMELINE_TYPE_ID]: 'lg:w-3/3',
    [widgetDataTypes.TABLE_TYPE_ID]: 'lg:w-3/3',
    [widgetDataTypes.COUNTER_TYPE_ID]: 'lg:w-1/3',
    [widgetDataTypes.CHART_SPEEDOMETER]: 'lg:w-1/3',
    [widgetDataTypes.CHART_QUEUE]: 'lg:w-3/3',
    [widgetDataTypes.EXTENSION_CARDS]: 'lg:w-3/3',
    [widgetDataTypes.HISTORY_COUNTERS]: 'lg:w-3/3',
    [widgetDataTypes.REAL_TIME_TABLE]: 'lg:w-3/3',
    default: 'lg:w-3/3'
}

export function getDataTypeClass(widget) {
    let dataType = 'default'
    try {
        dataType = getWidgetDataType(widget)
    } catch (e) {
        console.warn(e)
    }
    return componentWidth[dataType]
}
