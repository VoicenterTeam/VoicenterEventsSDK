import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const entitiesApi = {
    async getList() {
        try {
            let res = await $axios.get('/Login/EntitiesList/')
            console.log(res);
            return res.Data
        } catch (e) {
            parseCatch(e, true, 'Entities List')
        }
    }
}
