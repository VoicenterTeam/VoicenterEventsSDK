import $axios from './apiConnection'

import {widgets} from '@/store/mockData'

export const WidgetApi = {
    //TODO: add some widgets on back and use it
    getAll() {
        return widgets
    },
    // async getAll() {
    //
    //     try {
    //         let widgets = await $axios.get('/Widgets/GetAllWidgets/')
    //         return widgets.WidgetList
    //     } catch (e) {
    //         if(process.env.VUE_APP_ENV === 'local') {
    //             return widgets
    //         }
    //         return  []
    //     }

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
