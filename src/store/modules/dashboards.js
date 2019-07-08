import { getDashboards } from '@/services/dashboardService'
import { widgets } from "@/store/mockData";
import Vue from 'vue'

const types = {
  SET_ALL_DASHBOARDS: 'SET_ALL_DASHBOARDS',
  SET_ACTIVE_DASHBOARD: 'SET_ACTIVE_DASHBOARD',
  SET_DEFAULT_DASHBOARD: 'SET_DEFAULT_DASHBOARD',
  ADD_DASHBOARD: 'ADD_DASHBOARD',
  UPDATE_DASHBOARD: 'UPDATE_DASHBOARD'
};
const state = {
  allDashboards: {},
  activeDashboard: null
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
  [types.ADD_DASHBOARD]: (state, { key, value }) => {
    state.allDashboards = {
      ...state.allDashboards,
      [key]: value
    }
  },
  [types.UPDATE_DASHBOARD]: (state, { dashboard }) => {
    let keys = Object.keys(state.allDashboards)
    keys.forEach(dashboardKey => {
      if(state.allDashboards[dashboardKey].ID === dashboard.ID){
        Vue.set(state.allDashboards, dashboardKey, dashboard)
      }
    })
  },
  [types.SET_ACTIVE_DASHBOARD]: (state, value) => {
    state.activeDashboard = value
  },
  [types.SET_DEFAULT_DASHBOARD]: (state) => {
    let keys = Object.keys(state.allDashboards)
    if (keys.length) {
      let dashboard = state.allDashboards[keys[0]]
      state.activeDashboard = sortDashboardWidgetsByorder(dashboard)
    }
  }
};

const actions = {
  async getDashboards({ commit, state }) {
    let dashboards = await getDashboards()
    commit(types.SET_ALL_DASHBOARDS, dashboards)
    if (!state.activeDashboard) {
      commit(types.SET_DEFAULT_DASHBOARD)
    }
  },
  async selectDashboard({ commit, state }, dashboard) {
    // TODO add api call to update selected dashboard ?
    commit(types.SET_ACTIVE_DASHBOARD, dashboard)
  },
  async createDashboard({ commit }, newDashboard) {
    // TODO call api to add dashboard
    const dashboard = {
      "ID": Math.random() * 100,
      "Title": newDashboard.title,
      "WidgetGroupList": [
        {
          "ID": Math.random() * 100,
          "Title": "General Group Title",
          "WidgetList": []
        }
      ]
    }
    let dashboardKey = `dashboard-${dashboard.ID}`
    commit(types.ADD_DASHBOARD, {
      key: dashboardKey,
      value: dashboard
    })
    commit(types.SET_ACTIVE_DASHBOARD, dashboard)
  },
  async updateDashboard({commit}, dashboard){
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
