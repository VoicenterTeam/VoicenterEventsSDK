import parseCatch from '@/helpers/handleErrors'
import httpInterceptor from "./cPanelApiConnection";

export const WidgetFiltersApi = {
    async getAutocompletes(endPoint) {
        try {
            let res = await httpInterceptor.post(endPoint, {})
            console.log(res)
            return res
        } catch (e) {
            parseCatch(e, true, 'Get Filter Data')
        }
    },
}
