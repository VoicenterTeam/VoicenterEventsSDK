import $axios from '@/api/apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const reportApi = {
    async list() {
        try {
            const { Data } = await $axios.post('/Report/List/', {})
            return Data
        } catch (e) {
            parseCatch(e, true, 'Report List')
        }
    },
    async store(payload) {
        try {
            const { Data } = await $axios.post('/Report/Add/', payload)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Add Report')
        }
    },
    async update(payload) {
        try {
            const { Data } = await $axios.post('/Report/Update/', payload)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Update Report')
        }
    },
    async changeStatus(payload) {
        try {
            await $axios.post('/Report/ChangeStatus/', payload)
        } catch (e) {
            parseCatch(e, true, 'Change Status')
        }
    },
}
