import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

const SUCCESS_STATUS = 'OK'

export const WidgetApi = {
    async find(id) {
        try {
            console.log(await $axios.get(`/Widgets/Get/${id}`))
            return await $axios.get(`/Widgets/Get/${id}`)
        } catch (e) {
            parseCatch(e, true, 'Find Widget')
        }
    },
    async update(data) {
        try {
            if (!data.WidgetTime) {
                data.WidgetTime = {}
            }
            if (data.Order === null) {
                data.Order = 0
            }
            
            if (!data.WidgetConfig) {
                data.WidgetConfig = []
            } else {
                data.WidgetConfig = data.WidgetConfig.filter(config => config.ParameterID)
            }
            
            let result = await $axios.post(`/Widgets/Update/`, data)
            return parseCustomErrorMessage(result, 'Update Widget')
        } catch (e) {
            parseCatch(e, true, 'Update Widget')
        }
    },
    async updatePosition(data) {
        try {         
            const widgetList = {
                WidgetList: data
            }   
            let result = await $axios.post(`/Widgets/UpdatePosition/`, widgetList)
            return parseCustomErrorMessage(result, 'Update Widget Position')
        } catch (e) {
            parseCatch(e, true, 'Update Widget')
        }
    },

    async store(data) {
        try {
            if (!data.WidgetConfig) {
                data.WidgetConfig = []
            }
            let result = await $axios.post('/Widgets/Add/', data)
            return parseCustomErrorMessage(result, 'Add Widget')
        } catch (e) {
            parseCatch(e, true, 'Add Widget')
        }
    },

    destroy(widgetId) {
        return $axios.post(`/Widgets/Delete/${widgetId}`)
    },
}

function parseCustomErrorMessage(result, prefixMessage) {
    if (typeof result === 'string' && result !== SUCCESS_STATUS) {
        let apiError = { message: result }
        parseCatch(apiError, true, prefixMessage)
    }
    return result
}
