import $axios from './apiConnection'
import instance from './apiConnectionExternal'
import parseCatch from '../helpers/handleErrors'

export const WidgetDataApi = {
    async getData(endPoint) {
        try {
            let res = await $axios.post(endPoint)
            return res.Data
        } catch (e) {
            parseCatch(e, true)
        }
    },

    async getExternalData(endPoint) {
        try {
            let res = await instance.post(endPoint)
            return res.Data
        } catch (e) {
            parseCatch(e, true)
        }
    }
}
