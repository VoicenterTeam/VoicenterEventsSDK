import Vue from 'vue'
import { DashboardApi } from '@/api/dashboardApi'
import { DEFAULT_LAYOUT_ID } from '@/enum/generic'
import get from 'lodash/get'
import $axios from '@/api/apiConnection'
import { dashboardModel } from '@/models/instances'

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
    SET_ACTIVE_WIDGET_GROUP: 'SET_ACTIVE_WIDGET_GROUP',
    ADD_DASHBOARD: 'ADD_DASHBOARD',
    UPDATE_DASHBOARD: 'UPDATE_DASHBOARD',
    DELETE_DASHBOARD: 'DELETE_DASHBOARD',
    RESET_ACTIVE_DASHBOARD: 'RESET_ACTIVE_DASHBOARD',
    SET_LOADING: 'SET_LOADING',
    UPDATE_CURRENT_DASHBOARD: 'UPDATE_CURRENT_DASHBOARD',
    MAP_ALL_WIDGETS: 'MAP_ALL_WIDGETS',
}
const state = {
    allDashboards: [],
    activeDashboard: null,
    activeWidgetGroup: null,
    editMode: false,
    loadingData: false,
    allWidgets: [],
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
        localStorage.setItem(ACTIVE_DASHBOARD, JSON.stringify(dashboard))
        if (dashboard && !dashboard.DashboardLayoutID) {
            dashboard.DashboardLayoutID = DEFAULT_LAYOUT_ID
        }
    },
    [types.SET_ACTIVE_WIDGET_GROUP]: (state, group) => {
        state.activeWidgetGroup = group
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
    [types.UPDATE_CURRENT_DASHBOARD]: (state, dashboard) => {
        state.activeDashboard = dashboard
    },
    [types.MAP_ALL_WIDGETS]: (state, widgets) => {
        state.allWidgets = widgets
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
        dashboard = dashboard || previousDashboard || get(state, 'allDashboards.[0]', false)
        if (!dashboard) {
            return commit(types.SET_ACTIVE_DASHBOARD, '')
        }
        commit(types.SET_LOADING, true)
        if (!dashboard['DashboardLayoutID']) {
            dashboard['DashboardLayoutID'] = DEFAULT_LAYOUT_ID
            await DashboardApi.update(dashboard)
        }
        
        dashboard = await DashboardApi.find(dashboard.DashboardID)
        commit(types.SET_ACTIVE_DASHBOARD, dashboard)
        commit(types.SET_LOADING, false)
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
    async setActiveGroup({ commit }, group) {
        commit(types.SET_ACTIVE_WIDGET_GROUP, group)
    },
    async updateDashboardLayout({ commit, state }, LayoutID) {
        let dashboard = state.activeDashboard
        dashboard['DashboardLayoutID'] = LayoutID
        await DashboardApi.update(dashboard)
        commit(types.SET_ACTIVE_DASHBOARD, dashboard)
    },
    async updateCurrentDashboard({ commit }, dashboard) {
        commit(types.UPDATE_CURRENT_DASHBOARD, dashboard)
    },
    async mapAllDashboardsWidgets({ commit, state }) {
        let widgets = []
        
        for (let dashboard of state.allDashboards) {
            const { WidgetGroupList } = await DashboardApi.find(dashboard.DashboardID)
            const groupWidgets = WidgetGroupList.map(group => group.WidgetList)
            widgets = widgets.concat(...groupWidgets)
        }
        commit(types.MAP_ALL_WIDGETS, widgets)
    },
}

const getters = {
    getActiveDashboard: state => {
        return state.activeDashboard
    },
    getEditModeState: state => {
        return state.editMode
    },
    getActiveWidgetGroup: state => {
        return state.activeWidgetGroup
    },
    getAllWidgets: state => {
        return state.allWidgets
    },
    //ParameterType: 2
    getWidgetsWithColumnTypeInt: state => {
        const {allWidgets: widgets = []} = state
        if (!widgets.length) {
            return []
        }
        const result = []
        widgets.forEach(widget => {
        
        })
        return result
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
