import { getDashboards } from '@/services/dashboardService'

const types = {
  SET_ALL_DASHBOARDS: 'SET_ALL_DASHBOARDS',
  SET_ACTIVE_DASHBOARD: 'SET_ACTIVE_DASHBOARD',
  SET_DEFAULT_DASHBOARD: 'SET_DEFAULT_DASHBOARD',
  UPDATE_WIDGET_GROUP_WIDGETS: 'UPDATE_WIDGET_GROUP_WIDGETS'
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
