import {WidgetApi} from '@/api/widgetApi'
import {widgetModel} from '@/models/instances'
import {WidgetDataApi} from '@/api/widgetDataApi'
import {isExternalDataWidget} from '@/helpers/widgetUtils'
import {getOptionsValues} from '@/helpers/entitiesList'

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
                let options = getOptionsValues(config.ParameterID)
                config.WidgetParameterValue = options ? options.toString() : ''
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
    } else {
        let bodyElement = document.querySelector("body");
        if (bodyElement.classList.contains("el-popup-parent--hidden")) return;

        return await WidgetDataApi.getData(widget.EndPoint);
    }
}
