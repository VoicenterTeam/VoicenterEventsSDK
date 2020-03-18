import {WidgetApi} from '@/api/widgetApi'
import {widgetModel} from '@/models/instances'
import {WidgetDataApi} from '@/api/widgetDataApi'
import {isExternalDataWidget} from '@/helpers/widgetUtils'
import {getOptionsValues} from '@/helpers/entitiesList'
import store from '../store/store'
const AUTO_COMPLETE_TYPE_KEY = 6

// Create new widgets from Widget Templates
export async function createNewWidgets(templates, widgetGroup, Order = false) {

    let widgets = []
    let index = 0

    for (let template of templates) {
        let newWidget = widgetModel(template.TemplateID, template.TemplateName, {
            Order: Order ? Order : widgetGroup.WidgetList.length + index++,
            DataTypeID: template.DataType.DataTypeID,
            Endpoint: template.Endpoint,
            DefaultRefreshInterval: template.DefaultRefreshInterval
        })

        let WidgetConfig = []
        if (template.DefaultWidgetConfig.length) {
            for (let config of template.DefaultWidgetConfig) {
                if (config.ParameterType === AUTO_COMPLETE_TYPE_KEY) {
                    let options = getOptionsValues(config.ParameterName)
                    config.WidgetParameterValueJson = {
                        EntityPositive: options,
                        EntityNegative: [],
                        AccountList: [store.state.entities.selectedAccountID]
                    }
                    config.WidgetParameterValue = JSON.stringify(config.WidgetParameterValueJson)
                }
                WidgetConfig.push(config)
            }
        }

        newWidget.WidgetConfig = WidgetConfig
        newWidget.WidgetTime = template.DefaultWidgetTime || {}

        newWidget = await WidgetApi.store(newWidget)
        widgets.push(newWidget)
    }
    return widgets;
}

export function removeDummyWidgets(widgetIds) {
    widgetIds.forEach((id) => {
        WidgetApi.destroy(id)
    })
}

export async function getWidgetData(widget) {
    if (isExternalDataWidget(widget)) {
        return await WidgetDataApi.getExternalData(widget.EndPoint)
    }

    if (isWidgetModalOpen() || isInEditMode()) return null;

    return await WidgetDataApi.getData(widget.EndPoint);
}

export function isWidgetModalOpen() {
    let bodyElement = document.body;
    return bodyElement.classList.contains("el-popup-parent--hidden")
}

export function isInEditMode() {
    return store.state.dashboards.editMode
}
