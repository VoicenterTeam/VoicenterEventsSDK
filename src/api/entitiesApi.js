import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'
import { ADMIN_USER_EXTENSION_CONFIG } from '@/helpers/util'

export const entitiesApi = {
    async getList() {
        try {
            let { Data } = await $axios.get('/Login/EntitiesList/')
            if (Data && Data.Extension) {
                 Data.Extension.splice(0, 0, ADMIN_USER_EXTENSION_CONFIG)
            }
            console.log(Data)
            return Data
        } catch (e) {
            parseCatch(e, false, 'Entities List')
        }
    }
}
