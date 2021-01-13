import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const entitiesApi = {
    async getList() {
        try {
            let { Data } = await $axios.get('/Login/EntitiesList/')
            return Data
        } catch (e) {
            parseCatch(e, false, 'Entities List')
        }
    }
}
