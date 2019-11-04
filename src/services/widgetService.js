import {WidgetApi} from '@/api/widgetApi'
import {widgetModel} from '@/models/instances'
import {WidgetGroupsApi} from '@/api/widgetGroupApi'

// Create new widgets from Widget Templates
export async function createNewWidgets(templates, widgetGroup, Order = false) {

    let widgets = []
    let index = 0

    for (let template of templates) {
        let newWidget = widgetModel(template.TemplateID, template.TemplateName, {
            Order: Order ? Order : widgetGroup.WidgetList.length + index++,
            DataTypeID: template.DataType.DataTypeID,
            Endpoint: template.Endpoint,
        })
        newWidget.WidgetConfig= template.DefaultWidgetConfig || [],
        newWidget.WidgetTime= template.DefaultWidgetTime || {},

        newWidget = await WidgetApi.store(newWidget)
        widgets.push(newWidget)

        if (!widgetGroup.IsNew) {
            await WidgetGroupsApi.addWidget(widgetGroup.WidgetGroupID, newWidget.WidgetID)
        }
    }
    return widgets;
}

export function removeDummyWidgets(widgetIds) {
    widgetIds.forEach((id) => {
        WidgetApi.destroy(id)
    })
}
