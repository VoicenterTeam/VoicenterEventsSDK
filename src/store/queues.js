const types = {
    SET_QUEUES: 'SET_QUEUES',
    UPDATE_QUEUES: 'UPDATE_QUEUES',
}
const state = {
    all: [],
}

const mutations = {
    [types.SET_QUEUES]: (state, value) => {
        state.all = value
    },
    [types.UPDATE_QUEUES]: (state, {index, queue}) => {
        state.all.splice(index, 1, queue)
    },
}

const actions = {
    async setQueues({commit}, value) {
        commit(types.SET_QUEUES, value)
    },
    async updateQueue({commit}, value) {
        commit(types.UPDATE_QUEUES, value)
    },
}

const getters = {
  queueWithActiveCalls: (state) => {
    return state.all.filter((el) => el.Calls.length)
  },
  allQueueCalls: (state, getters) => {
    const allCalls = []
    getters.queueWithActiveCalls.forEach((queue) => {
      const calls = queue.Calls || []
      allCalls.push(...calls)
    })
    return allCalls
  },
  filterQueuesByIds: (state) => queueIds => {
    if (!queueIds || !Array.isArray(queueIds)) {
      return state.all
    }
    this.state.all.filter(e => queueIds.includes(e.QueueID))
  }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
