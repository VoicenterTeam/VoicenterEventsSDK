const types = {
    SET_QUEUES: 'SET_QUEUES',
    UPDATE_QUEUES: 'UPDATE_QUEUES',
};
const state = {
    all: [],
};

const mutations = {
    [types.SET_QUEUES]: (state, value) => {
        state.all = value
    },
    [types.UPDATE_QUEUES]: (state, {index, queue}) => {
        state.all.splice(index, 1, queue)
    },
};

const actions = {
    async setQueues({commit}, value) {
        commit(types.SET_QUEUES, value)
    },
    async updateQueue({commit}, value) {
        commit(types.UPDATE_QUEUES, value)
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
