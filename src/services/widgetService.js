import get from 'lodash/get'
import Vue from 'vue'
import store from '@/store/store'
import { WidgetApi } from '@/api/widgetApi'
import { widgetModel } from '@/models/instances'
import { WidgetDataApi } from '@/api/widgetDataApi'
import { getOptionsValues } from '@/helpers/entitiesList'
import { isExternalDataWidget } from '@/helpers/widgetUtils'


const AUTO_COMPLETE_TYPE_KEY = 6

// Create new widgets from Widget Templates
export async function createNewWidgets(templates, widgetGroup, Order = false) {

    let widgets = []
    let index = 0

    for (let template of templates) {

        const templateWidth = get(template, 'TemplateSettings.DefaultWidthPrecentage', '100')
        const templateHeight = get(template, 'TemplateSettings.DefaultHeightPixels', '160')

        let widgetLayout = template.WidgetLayout

        widgetLayout['GridLayout']['width'] = Math.ceil(12 * Number(templateWidth) / 100)
        widgetLayout['GridLayout']['height'] = Math.floor(Number(templateHeight) / 80)

        let newWidget = widgetModel(template.TemplateID, template.TemplateName, {
            Order: Order ? Order : widgetGroup.WidgetList.length + index++,
            DataTypeID: template.DataType.DataTypeID,
            Endpoint: template.Endpoint,
            DefaultRefreshInterval: template.DefaultRefreshInterval,
            ...widgetLayout,
        })

        let WidgetConfig = []

        if (template.DefaultWidgetConfig.length) {
            for (let config of template.DefaultWidgetConfig) {
                if (config.ParameterType === AUTO_COMPLETE_TYPE_KEY) {
                    let options = getOptionsValues(config.ParameterName)
                    config.WidgetParameterValueJson = {
                        EntityPositive: options,
                        EntityNegative: [],
                        AccountList: [store.state.entities.selectedAccountID],
                    }
                    config.WidgetParameterValue = JSON.stringify(config.WidgetParameterValueJson)
                }
                WidgetConfig.push(config)
            }
        }

        newWidget.WidgetConfig = WidgetConfig
        newWidget.WidgetTime = template.DefaultWidgetTime || {}

        newWidget = await WidgetApi.store(newWidget)

        if (typeof newWidget !== 'string') {
            widgets.push(newWidget)
        }

    }
    return widgets
}

export function removeDummyWidgets(widgetIds) {
    widgetIds.forEach((id) => {
        WidgetApi.destroy(id)
    })
}

export async function getWidgetData(widget) {

    if (isWidgetModalOpen() || isInEditMode()) {
        return null
    }

    Vue.set(widget, 'onLoading', true)

    if (isExternalDataWidget(widget)) {
        const data = await WidgetDataApi.getExternalData(widget.EndPoint)
        Vue.set(widget, 'onLoading', false)
        return data
    }


    const data = await WidgetDataApi.getData(widget.EndPoint)
    Vue.set(widget, 'onLoading', false)
    return data
}

export function isWidgetModalOpen() {
    let bodyElement = document.body
    return bodyElement.classList.contains('el-popup-parent--hidden')
}

export function isInEditMode() {
    return store.state.dashboards.editMode
}
