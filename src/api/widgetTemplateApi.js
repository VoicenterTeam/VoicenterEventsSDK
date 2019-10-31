import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const widgetTemplateApi = {
    async getAll() {
        try {
            let res = await $axios.post('/WidgetsTemplate/List/', {})
            return res.Data
        } catch (e) {
            parseCatch(e, true, 'Widget Templates')
        }
    }
}
