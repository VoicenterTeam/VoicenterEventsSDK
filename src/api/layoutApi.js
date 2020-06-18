import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const LayoutApi = {
    async globals (data) {
        try {
            const result = await $axios.post('/Layout/List/', data)
            return result.Data
        } catch (e) {
            parseCatch(e, true, 'Get Global Layouts')
        }
    },
}
