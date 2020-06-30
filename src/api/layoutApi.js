import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'
import {Notification} from "element-ui";
import i18n from "@/i18n";

export const LayoutApi = {
    async get(data) {
        try {
            const result = await $axios.post('/Layout/List/', data)
            return result.Data
        } catch (e) {
            parseCatch(e, true, 'Get Layouts')
        }
    },

    async update(data) {
        try {
            const result = await $axios.post('/Layout/Upsert/', data)
            Notification.success(i18n.t('Layout updated with success'))
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
