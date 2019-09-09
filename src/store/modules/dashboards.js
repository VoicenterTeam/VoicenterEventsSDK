import {DashboardApi} from "@/api/dashboardApi";
import Vue from 'vue'

const types = {
    SET_ALL_DASHBOARDS: 'SET_ALL_DASHBOARDS',
    SET_ACTIVE_DASHBOARD: 'SET_ACTIVE_DASHBOARD',
    ADD_DASHBOARD: 'ADD_DASHBOARD',
    UPDATE_DASHBOARD: 'UPDATE_DASHBOARD'
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
        state.allDashboards = {
            ...state.allDashboards,
            ...value
        }
    },
    [types.UPDATE_DASHBOARD]: (state, dashboard) => {
        state.allDashboards.forEach((el, index) => {
            if (el.DashBoardsID === dashboard.DashBoardsID) {
                Vue.set(state.allDashboards, index, dashboard)
            }
        })
        state.activeDashboard = dashboard
    },
    [types.SET_ACTIVE_DASHBOARD]: (state, dashboard) => {
        state.activeDashboard = dashboard
    },
};

const actions = {
    async getDashboards({commit}) {
        state.loadingData = true
        let dashboards = await DashboardApi.getAll()
        state.loadingData = false
        commit(types.SET_ALL_DASHBOARDS, dashboards)

    },
    async selectDashboard({commit, state}, dashboard) {
        dashboard = dashboard || state.allDashboards[0]
        if (dashboard) {
            state.loadingData = true
            dashboard = await DashboardApi.find(dashboard.DashboardID)
            state.loadingData = false
            commit(types.SET_ACTIVE_DASHBOARD, dashboard)
        }
    },
    async createDashboard({commit}, dashboard) {
        await DashboardApi.store(dashboard)

        commit(types.ADD_DASHBOARD, dashboard)
        commit(types.SET_ACTIVE_DASHBOARD, dashboard)
    },
    async updateDashboard({commit}, dashboard) {
        await DashboardApi.update(dashboard)
        commit(types.UPDATE_DASHBOARD, dashboard)
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
