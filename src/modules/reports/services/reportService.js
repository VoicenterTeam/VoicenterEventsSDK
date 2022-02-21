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
    async info(id) {
        try {
            const { Data } = await $axios.get(`/Report/Info/${id}`)
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
            const { Data } = await $axios.post('/Report/ChangeStatus/', payload)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Change Status')
        }
    },
    async itemUpsert(item) {
        try {
            const { Data } = await $axios.post('/Report/ItemUpsert/', item)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Report Item Upsert')
        }
    },
    async recipientUpsert(recipient) {
        try {
            const { Data } = await $axios.post('/Report/RecipientUpsert/', recipient)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Report Recipient Upsert')
        }
    },
    async itemChangeStatus(payload) {
        try {
            const { Data } = await $axios.post('/Report/ItemChangeStatus/', payload)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Report Item Status Upsert')
        }
    },
    
}
