import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const WidgetApi = {
    async getAll() {
        try {
            let res = await $axios.get('/Widgets/GetAllWidgets/')
            return res.WidgetList
        } catch (e) {
            parseCatch(e, true)
        }
    },

    async update(data) {
        try {
            return await $axios.post(`/Widgets/Update/`, data)
        } catch (e) {
            parseCatch(e, true)
        }
    },

    async store(data) {
        try {
            return await $axios.post('/Widgets/Add/', data)
        } catch (e) {
            parseCatch(e, true)
        }
    },

    destroy(widgetId) {
        return $axios.post(`/Widgets/Delete/${widgetId}`)
    }
}
