import i18n from '@/i18n'
import $axios from './apiConnection'
import { Notification } from 'element-ui'
import parseCatch from '@/helpers/handleErrors'

export const LayoutApi = {
    async get(data) {
        try {
            const { Data } = await $axios.post('/Layout/List/', data)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Get Layouts')
        }
    },
    async update(data) {
        try {
            const result = await $axios.post('/Layout/Upsert/', data)
            if (data.LayoutID) {
                Notification.success(i18n.t('Layout updated with success'))
            } else {
                Notification.success(i18n.t('Layout added with success'))
            }
            return result
        } catch (e) {
            parseCatch(e, true, 'Update Account Layout')
        }
    },
    async updateStatus(data) {
        try {
            return await $axios.post('/Layout/UpdateStatus/', data)
        } catch (e) {
            parseCatch(e, true, 'Update Layout Status')
        }
    },
}
