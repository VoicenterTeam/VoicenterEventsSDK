import $axios from './apiConnection'
import store from '@/store/store'
import parseCatch from '@/helpers/handleErrors'
import cloneDeep from 'lodash/cloneDeep'

function currentAccountId() {
    return store.state.entities.selectedAccountID
}

const initialTime = (new Date().getTime() / 1000).toFixed(0)

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function userDashboards(dashboards) {
    const currentAccount = currentAccountId()
    return dashboards.filter(dashboard => dashboard.AccountID.toString() === currentAccount.toString())
}

export const DashboardApi = {
    async getAll() {
        try {
            let { DashBoards } = await $axios.get('/DashBoards/GetAll/')
            if (!currentAccountId()) {
                return DashBoards
            }
            return await userDashboards(DashBoards)
        } catch (e) {
            
            const currentTime = (new Date().getTime() / 1000).toFixed(0)
            
            if (currentTime - initialTime < 11) {
                await timeout(2000)
                return await this.getAll()
            }
            
            parseCatch(e, true)
            setTimeout(() => {
                window.location.href = process.env.VUE_APP_FALLBACK_URL
            }, 1000)
        }
    },
    
    async find(id) {
        try {
            const { Data } = await $axios.get(`/DashBoards/Get/${id}`)
            return Data.Dashboard
        } catch (e) {
            parseCatch(e, true, 'Find Dashboard')
        }
    },
    
    async update(data) {
        try {
            const copyOfData = cloneDeep(data)
            const widgetGroupList = copyOfData.WidgetGroupList

            if (copyOfData.WidgetGroupList && copyOfData.WidgetGroupList.length) {
                delete copyOfData.WidgetGroupList
            }

            const dashboardData = await $axios.post(`/DashBoards/Update/`, copyOfData)
            dashboardData.WidgetGroupList = widgetGroupList
            
            return dashboardData
        } catch (e) {
            parseCatch(e, true, 'Update Dashboard')
        }
    },
    
    async store(data) {
        try {
            return await $axios.post(`/DashBoards/Add/`, data)
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
    },

    async copy(data) {
        try {
            return await $axios.post(`/DashBoards/Copy/`, data)
        } catch (e) {
            parseCatch(e, true)
        }
    }
}
