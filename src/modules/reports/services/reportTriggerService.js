import $axios from '@/api/apiConnection'
import parseCatch from '@/helpers/handleErrors'

export const reportTriggerApi = {
    async createReportTrigger(data) {
        try {
            const { Data } = await $axios.post('/Report/TriggerUpsert/', data)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Report Trigger Upsert')
        }
    }
}