import $axios from './apiConnection'
import parseCatch from "../helpers/handleErrors";

export const WidgetDataApi = {
    async tableData(widgetID) {
        try {
            let res = await $axios.get(`/WidgetsData/GetTableData/${widgetID}`)
            console.log(res)
            return res.Data
        } catch (e) {
            parseCatch(e, true)
        }
    },
}
