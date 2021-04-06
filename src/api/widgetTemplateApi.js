import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const widgetTemplateApi = {
    async getAll(templateIds) {
        try {
            const { Data } = await $axios.post('/WidgetsTemplate/List/', templateIds)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Widget Templates')
        }
    }
}
