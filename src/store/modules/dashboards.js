import Vue from 'vue'
import { DashboardApi } from '@/api/dashboardApi'
import { DEFAULT_LAYOUT_ID } from '@/enum/generic'

const ACTIVE_DASHBOARD = 'active-dashboard'

function previousActiveDashboard() {
    let dashboard = localStorage.getItem(ACTIVE_DASHBOARD)
    try {
        dashboard = JSON.parse(dashboard)
    } catch (e) {
        console.log(e)
    }
    return dashboard
}

const types = {
    SET_ALL_DASHBOARDS: 'SET_ALL_DASHBOARDS',
    SET_EDIT_MODE: 'SET_EDIT_MODE',
    SET_ACTIVE_DASHBOARD: 'SET_ACTIVE_DASHBOARD',
    ADD_DASHBOARD: 'ADD_DASHBOARD',
    UPDATE_DASHBOARD: 'UPDATE_DASHBOARD',
    DELETE_DASHBOARD: 'DELETE_DASHBOARD',
    RESET_ACTIVE_DASHBOARD: 'RESET_ACTIVE_DASHBOARD',
    SET_LOADING: 'SET_LOADING',
}
const state = {
    allDashboards: [],
    activeDashboard: null,
    editMode: false,
    loadingData: false,
}

const mutations = {
    [types.SET_ALL_DASHBOARDS]: (state, value) => {
        state.allDashboards = value
    },
    [types.ADD_DASHBOARD]: (state, value) => {
        state.allDashboards.push(value)
    },
    [types.UPDATE_DASHBOARD]: (state, dashboard) => {
        state.allDashboards.forEach((el, index) => {
            if (el.DashboardID === dashboard.DashboardID) {
                Vue.set(state.allDashboards, index, dashboard)
            }
        })
        state.activeDashboard = dashboard
        localStorage.setItem(ACTIVE_DASHBOARD, JSON.stringify(dashboard))
    },
    [types.SET_ACTIVE_DASHBOARD]: (state, dashboard) => {
        state.activeDashboard = dashboard

        if (!dashboard.DashboardLayoutID) {
            dashboard.DashboardLayoutID = DEFAULT_LAYOUT_ID
        }

        localStorage.setItem(ACTIVE_DASHBOARD, JSON.stringify(dashboard))
    },
    [types.SET_EDIT_MODE]: (state, value) => {
        state.editMode = value
    },
    [types.DELETE_DASHBOARD]: (state, dashboard) => {
        let index = state.allDashboards.findIndex((d) => d.DashboardID === dashboard.DashboardID)
        if (index !== -1) {
            state.allDashboards.splice(index, 1)
        }
    },
    [types.RESET_ACTIVE_DASHBOARD]: (state) => {
        state.activeDashboard = null
    },
    [types.SET_LOADING]: (state, loading) => {
        state.loadingData = loading
    },
}

const actions = {
    async getDashboards({ commit, state }) {
        commit(types.SET_LOADING, true)
        let dashboards = await DashboardApi.getAll()
        commit(types.SET_LOADING, false)
        commit(types.SET_ALL_DASHBOARDS, dashboards)
    },
    async selectDashboard({ commit, state }, dashboard) {
        const previousDashboard = previousActiveDashboard()
        dashboard = dashboard || previousDashboard || state.allDashboards[0]
        if (dashboard) {
            commit(types.SET_LOADING, true)
            if (!dashboard['DashboardLayoutID']) {
                dashboard['DashboardLayoutID'] = DEFAULT_LAYOUT_ID
                await DashboardApi.update(dashboard)
            }

            dashboard = await DashboardApi.find(dashboard.DashboardID)
            commit(types.SET_ACTIVE_DASHBOARD, dashboard)
            commit(types.SET_LOADING, false)
        }
    },
    async createDashboard({ commit }, dashboard) {
        dashboard = await DashboardApi.store(dashboard)
        commit(types.ADD_DASHBOARD, dashboard)
        commit(types.SET_ACTIVE_DASHBOARD, dashboard)
    },
    async updateDashboard({ commit }, dashboard) {
        commit(types.UPDATE_DASHBOARD, dashboard)
        commit(types.SET_LOADING, false)
    },
    setLoadingData({ commit }, value) {
        commit(types.SET_LOADING, value)
    },
    async deleteDashboard({ commit }, dashboard) {
        await DashboardApi.destroy(dashboard.DashboardID)
        commit(types.DELETE_DASHBOARD, dashboard)
    },
}

const getters = {
    getActiveDashboard: state => {
        return state.activeDashboard
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
