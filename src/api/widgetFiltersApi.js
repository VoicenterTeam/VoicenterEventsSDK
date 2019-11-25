import parseCatch from '@/helpers/handleErrors'
import httpInterceptor from "./cPanelApiConnection";

export const WidgetFiltersApi = {
    async getAutocompletes(endPoint) {
        try {
            let res = await httpInterceptor.post(endPoint, {})
            return res.Data
        } catch (e) {
            parseCatch(e, true, 'Get Filter Data')
        }
    },
}
