import $axios from './apiConnection'

export const WidgetApi = {
    async getAll() {

        try {
            let widgets = await $axios.get('/Widgets/GetAllWidgets/')
            return widgets.WidgetList
        } catch (e) {
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
