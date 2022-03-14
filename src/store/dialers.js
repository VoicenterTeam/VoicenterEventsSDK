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
  }
  // allQueueCalls: (state, getters) => {
  //   const allCalls = []
  //   getters.queueWithActiveCalls.forEach((queue) => {
  //     const calls = queue.Calls || []
  //     allCalls.push(...calls)
  //   })
  //   return allCalls
  // },
  // filterQueuesByIds: (state) => queueIds => {
  //   if (!queueIds || !Array.isArray(queueIds)) {
  //     return state.all
  //   }
  //   return state.all.filter(e => queueIds.includes(e.QueueID))
  // }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
