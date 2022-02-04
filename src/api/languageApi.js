import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const LanguageApi = {
    async getAll() {
        try {
            const { Data } = await $axios.post('/Language/List/', {})

            return Data
        } catch (e) {
            parseCatch(e, true, 'Get Layouts')
        }
    }
}

export const ContentsApi = {
    async getAll() {
        try {
            const { Data } = await $axios.post('/Contents/TagsList/', {})
            return Data
        } catch (e) {
            parseCatch(e, true, 'Get Layouts')
        }
    }
}
