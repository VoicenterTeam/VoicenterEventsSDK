import $axios from './apiConnection'
import {widgets} from '@/store/mockData'
import parseCatch from '@/helpers/handleErrors'

export const WidgetApi = {
    // TODO: get data from api
    async getAll() {
        return widgets
        /*try {
            let res = await $axios.get('/Widgets/GetAllWidgets/')
            return res.WidgetList
        } catch (e) {
            if (process.env.VUE_APP_ENV === 'local') {
                return widgets
            }
            return []
        }*/
    },

    async update(data) {
        try {
            return await $axios.post(`/Widgets/Update/`, data)
        } catch (e) {
            parseCatch(e, true)
        }
    },
}
