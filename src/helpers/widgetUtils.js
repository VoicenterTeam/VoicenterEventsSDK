import get from 'lodash/get'
import store from '@/store/store'
import format from 'date-fns/format'
import widgetDataTypes from '@/enum/widgetDataTypes'
import { queueActivityGaugeKey } from '@/enum/generic'
import { realTimeTableKey } from '@/enum/realTimeTableConfigs'

// minimum refresh interval for real-time widgets - 10 seconds
const MIN_REFRESH_INTERVAL = 10
const MULTI_QUEUES_DASHBOARD_KEY = 'GetMultiQueuesDashboard'

const CHART_DATA_TYPE_IDS = [
    widgetDataTypes.LINES_TYPE_ID,
    widgetDataTypes.BARS_WITH_LINES_TYPE_ID,
    widgetDataTypes.X_AXIS_TYPE_ID,
    widgetDataTypes.CHART_QUEUE,
    widgetDataTypes.PIE_TYPE_ID,
    widgetDataTypes.CHART_AREA_ID,
]

const minRefreshInterval = () => {
    return store.getters['layout/minRefreshInterval'] || MIN_REFRESH_INTERVAL
}

export function getWidgetRefreshInterval(widget) {
    let refreshInterval = get(widget, 'WidgetLayout.DefaultRefreshInterval')
    if (!refreshInterval) {
        let widgetTemplate = getWidgetTemplate(widget)
        refreshInterval = get(widgetTemplate, 'DefaultRefreshInterval', '')
    }
    
    let minInterval = minRefreshInterval()
    refreshInterval = Number(refreshInterval) <= minInterval ? minInterval : Number(refreshInterval)
    
    return Number(refreshInterval) * 1000
}

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
    [widgetDataTypes.COUNTER_TYPE_ID]: 'lg:w-auto',
    [widgetDataTypes.QUEUE_COUNTER_TYPE_ID]: 'lg:w-auto',
    [widgetDataTypes.TOTAL_OUTGOING_CALLS]: 'lg:w-auto',
    [widgetDataTypes.PIE_TYPE_ID]: '',
    default: 'lg:w-3/3',
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

export function isMultiQueuesDashboard(widget) {
    return widget.EndPoint.includes(MULTI_QUEUES_DASHBOARD_KEY)
}

export function isPieWidget(widget) {
    return widget.DataTypeID === widgetDataTypes.PIE_TYPE_ID || widget.WidgetLayout.ComponentTypeID === widgetDataTypes.PIE_TYPE_ID
}

export function isExternalDataWidget(widget) {
    return widget.DataTypeID === widgetDataTypes.EXTERNAL_DATA_TYPE_ID
}

export function isQueueTable(widget) {
    return widget.DataTypeID === widgetDataTypes.QUEUE_ACTIVE_CALL
}

export function isQueueGauge(widget) {
    return widget.DataTypeID === widgetDataTypes.CHART_SPEEDOMETER
}

export function isQueueChart(widget) {
    return widget.DataTypeID === widgetDataTypes.CHART_QUEUE
}

export function isQueueDashboardWidget(widget) {
    return widget.DataTypeID === widgetDataTypes.QUEUE_DASHBOARD && !isQueueActivityGauge(widget)
}

export function isQueueActivityGauge(widget) {
    return widget.EndPoint.includes(queueActivityGaugeKey)
}

export function isAreaChartWidget(widget) {
    return widget.DataTypeID === widgetDataTypes.CHART_AREA_ID
}

export function isHtmlEditor(widget) {
    return widget.DataTypeID === widgetDataTypes.RICH_TEXT_EDITOR_ID
}

export function isNoteListWidget(widget) {
    return widget.DataTypeID === widgetDataTypes.RICH_TEXT_EDITOR_LIST
}

export function isARealtimeTableWidget(widget) {
    let isQueueWidgetType = [widgetDataTypes.QUEUE_DASHBOARD, widgetDataTypes.QUEUE_ACTIVE_CALL].includes(widget.DataTypeID)
    return isQueueWidgetType || isRealtimeWidget(widget) || isMultiQueuesDashboard(widget)
}

export function timeFilterToHuman(widget, toFormat = 'dd/MM/yyyy') {
    let start = new Date()
    let end = new Date()
    
    const startDate = get(widget, 'WidgetTime.Date_interval', 0)
    const dateInterval = get(widget, 'WidgetTime.datedeff', 0)
    
    start.setDate(start.getDate() - startDate)
    end.setDate(end.getDate() - (startDate - dateInterval))
    
    return `${format(start, toFormat)}  -  ${format(end, toFormat)}`
}

export function isChartWidget(widget) {
    return CHART_DATA_TYPE_IDS.includes(widget.DataTypeID) || isQueueActivityGauge(widget) || isPieWidget(widget) || isQueueGauge(widget) || isFunnelChartWidget(widget)
}

export function isCounterAgentsInStatus(widget) {
    return widget.DataTypeID === widgetDataTypes.COUNTER_TYPE_ID
}

export function isFunnelChartWidget(widget) {
    return widget.DataTypeID === widgetDataTypes.INFO_TYPE_ID
}

export function isSocketsRealTimeTableWidget (widget) {
    return widget.DataTypeID === widgetDataTypes.DIALERS_TYPE_ID
}

