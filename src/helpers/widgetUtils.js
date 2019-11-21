import get from 'lodash/get'
import store from '@/store/store'
import widgetDataTypes from '@/enum/widgetDataTypes'
import {realTimeTableKey} from '@/enum/realTimeTableConfigs'

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
    [widgetDataTypes.COUNTER_TYPE_ID]: 'lg:w-1/3',
    [widgetDataTypes.CHART_SPEEDOMETER]: 'lg:w-1/3',
    [widgetDataTypes.QUEUE_COUNTER_TYPE_ID]: 'lg:w-1/3',
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

export function isRealtimeWidget(widget) {
    if (widget.EndPoint.includes(realTimeTableKey)) {
        return true
    } else if (widget.DataTypeID === widgetDataTypes.EXTENSION_CARDS) {
        return true
    }
    return false
}
