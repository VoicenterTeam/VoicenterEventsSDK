const types = {
    SET_QUEUES: 'SET_QUEUES',
    UPDATE_QUEUES: 'UPDATE_QUEUES',
};
const state = {
    queues: [],
};

const mutations = {
    [types.SET_QUEUES]: (state, value) => {
        state.queues = value
    },
    //TODO: to define complete functionality
    [types.UPDATE_QUEUES]: (state, {index, queue}) => {
        state.queues.splice(index, 1, queue)
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

const getters = {};

export default {
    namespaced: true,
    types,
    state,
    mutations,
    actions,
    getters
};
