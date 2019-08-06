import $axios from './apiConnection'

import {widgets} from '@/store/mockData'

export const WidgetApi = {
    getAll() {
        // return $axios.get(`/Widgets/GetAllWidgets`)
        return widgets
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
