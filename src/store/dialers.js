const types = {
  SET_DIALERS: 'SET_DIALERS',
  UPDATE_DIALERS: 'UPDATE_DIALERS',
}
const state = {
  all: [],
}

const mutations = {
  [types.SET_DIALERS]: (state, value) => {
    state.all = value
  },
  [types.UPDATE_DIALERS]: (state, data) => {
    state.all = data
  }
}

const actions = {
  async setDialers({commit}, value) {
    commit(types.SET_DIALERS, value)
  },
  async updateDialers({commit}, value) {
    commit(types.UPDATE_DIALERS, value)
  }
}

const getters = {
  getAllDialers: (state) => {
    return state.all
  },
  getAllDialersWithTypeIVR: (state) => {
    return state.all.filter(el => el.type === 'IVR')
  },
  getAllDialersWithTypeAUTOMATIC: (state) => {
    return state.all.filter(el => el.type === 'Automatic')
  }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
