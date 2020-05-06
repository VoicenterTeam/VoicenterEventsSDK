import Vue from 'vue'
import {DashboardApi} from '@/api/dashboardApi'

const ACTIVE_DASHBOARD = 'active-dashboard'

function previousActiveDashboard () {
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
    SET_LOADING: 'SET_LOADING',
    DELETE_DASHBOARD: 'DELETE_DASHBOARD',
    RESET_ACTIVE_DASHBOARD: 'RESET_ACTIVE_DASHBOARD'
};
const state = {
    allDashboards: [],
    activeDashboard: null,
    loadingData: false,
    editMode: false,
    settings: {}
};

const mutations = {
    [types.SET_ALL_DASHBOARDS]: (state, value) => {
        state.allDashboards = value;
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
        state.settings = dashboard.DashboardLayout.settings
    },
    [types.SET_ACTIVE_DASHBOARD]: (state, dashboard) => {
        state.activeDashboard = dashboard
        state.settings = dashboard ? dashboard.DashboardLayout.settings : {}
        localStorage.setItem(ACTIVE_DASHBOARD, JSON.stringify(dashboard))
    },
    [types.SET_LOADING]: (state, loading) => {
        state.loadingData = loading
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
    }
};

const actions = {
    async getDashboards ({commit, state}) {
        commit(types.SET_LOADING, true)
        let dashboards = await DashboardApi.getAll()
        commit(types.SET_LOADING, false)
        commit(types.SET_ALL_DASHBOARDS, dashboards)

    },
    async selectDashboard ({commit, state}, dashboard) {
        const previousDashboard = previousActiveDashboard()
        dashboard = dashboard || previousDashboard || state.allDashboards[0]
        if (dashboard) {
            commit(types.SET_LOADING, true)
            dashboard = await DashboardApi.find(dashboard.DashboardID)
            commit(types.SET_ACTIVE_DASHBOARD, dashboard)
            commit(types.SET_LOADING, false)
        }
    },
    async createDashboard ({commit}, dashboard) {
        dashboard = await DashboardApi.store(dashboard)
        commit(types.ADD_DASHBOARD, dashboard)
        commit(types.SET_ACTIVE_DASHBOARD, dashboard)
    },
    async updateDashboard ({commit}, dashboard) {
        commit(types.UPDATE_DASHBOARD, dashboard)
        commit(types.SET_LOADING, false)
    },
    setLoadingData ({commit}, value) {
        commit(types.SET_LOADING, value)
    },
    async deleteDashboard ({commit}, dashboard) {
        await DashboardApi.destroy(dashboard.DashboardID)
        commit(types.DELETE_DASHBOARD, dashboard)
    }
};

const getters = {
    baseColors: state => {
        return state.settings.colors
    },
    refreshDelay: state => {
        return state.settings.refreshRealTimeDataDelay
    },
    widgetGroupTitleStyles: state => {
        const {widgetGroupTitles} = state.settings.colors
        const {widgetGroupTitlesFontSize} = state.settings
        const styles = {}
        if (widgetGroupTitles) {
            styles.color = widgetGroupTitles
        }
        if (widgetGroupTitlesFontSize) {
            styles.fontSize = `${widgetGroupTitlesFontSize}px`
        }
        return styles
    },
    getActiveDashboard: state => {
        return state.activeDashboard
    },
    widgetTitleStyles: state => {
        const {widgetTitlesFontSize} = state.settings

        if (!widgetTitlesFontSize) {
            return {}
        }

        return {
            fontSize: `${widgetTitlesFontSize}px`
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
