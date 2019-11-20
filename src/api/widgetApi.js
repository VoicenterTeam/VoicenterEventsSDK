import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const WidgetApi = {
    async update(data) {
        try {
            if (!data.WidgetTime) {
                data.WidgetTime = {}
            }
            if (data.Order === null) {
                data.Order = 0
            }
            return await $axios.post(`/Widgets/Update/`, data)
        } catch (e) {
            parseCatch(e, true, 'Update Widget')
        }
    },

    async store(data) {
        try {
            return await $axios.post('/Widgets/Add/', data)
        } catch (e) {
            parseCatch(e, true, 'Add Widget')
        }
    },

    destroy(widgetId) {
        return $axios.post(`/Widgets/Delete/${widgetId}`)
    }
}
