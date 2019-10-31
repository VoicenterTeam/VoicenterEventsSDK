import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const templateCategoryApi = {
    async getAll() {
        try {
            let data = {}
            let res = await $axios.post('TemplatesCategory/CategoryList/', data)
            return res.CategoryList
        } catch (e) {
            parseCatch(e, true, 'Get Templates Category')
        }
    },
}
