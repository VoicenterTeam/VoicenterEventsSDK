import $axios from './apiConnection'

import {widgets} from '@/store/mockData'

export const WidgetApi = {
    async getAll() {

        try {
            let res = await $axios.get('/Widgets/GetAllWidgets/')
            return res.WidgetList
        } catch (e) {
            if (process.env.VUE_APP_ENV === 'local') {
                return widgets
            }
            return []
        }
    },

    find(id) {
        // return $axios.get(`/Widgets/Get/{$id}`)
    },

    update(data) {
        // return $axios.post(`/Widgets/Update/`)
    },

    store(data) {
        // return $axios.get(`/Widgets/Add/`)
    }
}
