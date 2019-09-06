import $axios from './apiConnection'
import parseCatch from "../helpers/handleErrors";

export const WidgetDataApi = {
    async getTableData(widgetID) {
        try {
            let res = await $axios.post(`/WidgetsData/GetTableData/${widgetID}`)
            return res.Data
        } catch (e) {
            parseCatch(e, true)
        }
    },
}
