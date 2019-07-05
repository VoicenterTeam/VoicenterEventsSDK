import { getDashboards } from '@/services/dashboardService'
import { widgets } from "@/store/mockData";

const types = {
  SET_ALL_DASHBOARDS: 'SET_ALL_DASHBOARDS',
  SET_ACTIVE_DASHBOARD: 'SET_ACTIVE_DASHBOARD',
  SET_DEFAULT_DASHBOARD: 'SET_DEFAULT_DASHBOARD',
  ADD_DASHBOARD: 'ADD_DASHBOARD',
  UPDATE_WIDGET_GROUP_WIDGETS: 'UPDATE_WIDGET_GROUP_WIDGETS',
  DELETE_WIDGET_GROUP_WIDGETS: 'DELETE_WIDGET_GROUP_WIDGETS',
  DELETE_WIDGET_GROUP: 'DELETE_WIDGET_GROUP'
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
  [types.SET_ACTIVE_DASHBOARD]: (state, value) => {
    state.activeDashboard = value
  },
  [types.UPDATE_WIDGET_GROUP_WIDGETS]: (state, { widgetGroup, widgets }) => {
    let newWidgetGroup = {
      ...widgetGroup,
      WidgetList: widgets
    }
    let index = state.activeDashboard.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
    if (index !== -1) {
      state.activeDashboard.WidgetGroupList.splice(index, 1, newWidgetGroup)
    }
  },
  [types.DELETE_WIDGET_GROUP_WIDGETS]: (state, { widgetGroup, widget }) => {
    let index = state.activeDashboard.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
    if (index !== -1) {
      let widgetIndex = state.activeDashboard.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.ID === widget.ID)
      if (index !== -1) {
        state.activeDashboard.WidgetGroupList[index].WidgetList.splice(widgetIndex, 1 )
      }
    }
  },
  [types.DELETE_WIDGET_GROUP]: (state, { widgetGroup }) => {
    let index = state.activeDashboard.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
    if (index !== -1) {
      state.activeDashboard.WidgetGroupList.splice(index, 1)
    }
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
  async updateWidgets({ commit, state }, { widgets, widgetGroup }) {
    // TODO add api call to update widgets
    commit(types.UPDATE_WIDGET_GROUP_WIDGETS, { widgetGroup, widgets })
  },
  async deleteWidgetGroupWidget({ commit, state }, { widgetGroup, widget }) {
    // TODO add api call to delete widget group
    commit(types.DELETE_WIDGET_GROUP_WIDGETS, { widgetGroup, widget })
  },
  async deleteWidgetGroup({ commit, state }, {  widgetGroup }) {
    // TODO add api call to delete widget group
    commit(types.DELETE_WIDGET_GROUP, { widgetGroup, widgets })
  },
  async createDashboard({ commit }, newDashboard) {
    // TODO call api to add dashboard
    const dashboard = {
      "ID": Math.random() * 100,
      "Title": newDashboard.title,
      "WidgetGroupList": [
        {
          "ID": Math.random() * 100,
          "Title": "widgetGroups.general.title",
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
