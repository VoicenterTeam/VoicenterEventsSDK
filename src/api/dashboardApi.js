import $axios from './apiConnection'
import {dashboards} from '@/store/mockData'
import parseCatch from '@/helpers/handleErrors'

export const DashboardApi = {
    async getAll() {
        try {
            let res = await $axios.get('/DashBoards/GetAll/')
            return res.DashBoards
        } catch (e) {
            if (process.env.VUE_APP_ENV === 'local') {
                return dashboards
            }
            parseCatch(e, true, 'Get Dashboard')
        }
    },

    async find(id) {
        try {
            let res = await $axios.get(`/DashBoards/Get/${id}`)
            return res.Data.Dashboard
        } catch (e) {
            parseCatch(e, true, 'Find Dashboard')
        }
    },

    async update(data) {
        try {
            return await $axios.post(`/DashBoards/Update/`, data)
        } catch (e) {
            parseCatch(e, true, 'Update Dashboard')
        }
    },

    async store(data) {
        try {
            let res = await $axios.post(`/DashBoards/Add/`, data)
            return res.Dashboard
        } catch (e) {
            parseCatch(e, true, 'Add Dashboard')
        }
    },

    async addWidgetGroup(dashboardID, widgetGroupID) {
        try {
            return await $axios.post(`/DashBoards/AddWidgetGroup/${dashboardID}/${widgetGroupID}`)
        } catch (e) {
            parseCatch(e, true, 'Add widget group to dashboard')
        }
    },

    async removeWidgetGroup(dashboardID, widgetGroupID) {
        try {
            return await $axios.post(`/DashBoards/RemoveWidgetGroup/${dashboardID}/${widgetGroupID}`)
        } catch (e) {
            parseCatch(e, true, 'Remove widget group from dashboard')
        }
    },

    async destroy(dashboardID) {
        try {
            return await $axios.post(`/DashBoards/RemoveDashboard/${dashboardID}`)
        } catch (e) {
            parseCatch(e, true)
        }
    }
}
