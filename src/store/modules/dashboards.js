import {DashboardApi} from "@/api/dashboardApi";
import Vue from 'vue'

const types = {
    SET_ALL_DASHBOARDS: 'SET_ALL_DASHBOARDS',
    SET_ACTIVE_DASHBOARD: 'SET_ACTIVE_DASHBOARD',
    ADD_DASHBOARD: 'ADD_DASHBOARD',
    UPDATE_DASHBOARD: 'UPDATE_DASHBOARD',
    SET_LOADING: 'SET_LOADING',
    REMOVE_DASHBOARD: 'REMOVE_DASHBOARD'
};
const state = {
    allDashboards: [],
    activeDashboard: null,
    loadingData: false
};

function sortDashboardWidgetsByorder(dashboard) {
    dashboard.WidgetGroupList = dashboard.WidgetGroupList.map(widgetGroup => {
        let WidgetList = widgetGroup.WidgetList.sort((a, b) => {
            return a.WidgetLayout.Order - b.WidgetLayout.Order
        });
        return {
            ...widgetGroup,
            WidgetList
        }
    })
    return dashboard
}

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
    },
    [types.SET_ACTIVE_DASHBOARD]: (state, dashboard) => {
        state.activeDashboard = dashboard
    },
    [types.SET_LOADING]: (state, loading) => {
        state.loadingData = loading
    },
    [types.REMOVE_DASHBOARD]: (state, dashboard) => {
        let index = state.allDashboards.findIndex((d) => d.DashboardID === dashboard.DashboardID)
        if (index !== -1) {
            state.allDashboards.splice(index, 1)
        }
    },
};

const actions = {
    async getDashboards({commit}) {
        commit(types.SET_LOADING, true)
        let dashboards = await DashboardApi.getAll()
        commit(types.SET_LOADING, false)
        commit(types.SET_ALL_DASHBOARDS, dashboards)

    },
    async selectDashboard({commit, state}, dashboard) {
        dashboard = dashboard || state.allDashboards[0]
        if (dashboard) {
            commit(types.SET_LOADING, true)
            dashboard = await DashboardApi.find(dashboard.DashboardID)
            commit(types.SET_ACTIVE_DASHBOARD, dashboard)
            commit(types.SET_LOADING, false)
        }
    },
    async createDashboard({commit}, dashboard) {
        dashboard = await DashboardApi.store(dashboard)
        commit(types.ADD_DASHBOARD, dashboard)
        commit(types.SET_ACTIVE_DASHBOARD, dashboard)
    },
    async updateDashboard({commit}, dashboard) {
        commit(types.UPDATE_DASHBOARD, dashboard)
        commit(types.SET_LOADING, false)
    },
    async setLoadingData({commit}, value) {
        commit(types.SET_LOADING, value)
    },
    async removeDashboard({commit}, dashboard) {
        await DashboardApi.destroy(dashboard.DashboardID)
        commit(types.REMOVE_DASHBOARD, dashboard)
    }
};
const getters = {};

export default {
    namespaced: true,
    types,
    state,
    mutations,
    actions,
    getters
};
