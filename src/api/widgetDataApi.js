import $axios from './apiConnection'
import parseCatch from "../helpers/handleErrors";

export const WidgetDataApi = {
    async getData(endPoint) {
        try {
            let res = await $axios.post(endPoint)
            return res.Data
        } catch (e) {
            parseCatch(e, true)
        }
    },
}
