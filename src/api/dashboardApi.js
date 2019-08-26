import $axios from './apiConnection'
import {dashboards} from '@/store/mockData'
import parseCatch from '../helpers/handleErrors'

export const DashboardApi = {
    async getAll() {
        try {
            let res = await $axios.get('/DashBoards/GetAll/')
            return res.DashBoards
        } catch (e) {
            if (process.env.VUE_APP_ENV === 'local') {
                return dashboards
            }
            parseCatch(e, true)
        }
    },

    async find(id) {
        try {
            let res =  await $axios.get(`/DashBoards/Get/${id}`)
            return res.Dashboard
        } catch (e) {
            parseCatch(e, true)
        }
    },

    async update(data) {
        return await $axios.post(`/DashBoards/Update/`, data)
    },

    async store(data) {
        let res = await $axios.post(`/DashBoards/Add/`, data)
        return res.Dashboard
    }
}
