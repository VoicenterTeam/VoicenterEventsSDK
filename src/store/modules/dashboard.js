import { getDashboards } from '@/services/dashboardService'
const types = {
  SET_ALL_DASHBOARDS: 'SET_ALL_DASHBOARDS'
};
const state = {
  allDashboards: {}
};

const mutations = {
  [types.SET_ALL_DASHBOARDS]: (state, value) => {
    state.allDashboards = value;
  }
};

const actions = {
  async getDashboards({commit}) {
    let dashboards = await getDashboards()
    commit(types.SET_ALL_DASHBOARDS, dashboards)
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
