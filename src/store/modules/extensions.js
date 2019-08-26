const types = {
    SET_EXTENSIONS: 'SET_EXTENSIONS',
    UPDATE_EXTENSIONS: 'UPDATE_EXTENSIONS',
};
const state = {
    extensions: [],
};

const mutations = {
    [types.SET_EXTENSIONS]: (state, value) => {
        state.extensions = value
    },
    [types.UPDATE_EXTENSIONS]: (state, {index, extension}) => {
        state.extensions.splice(index, 1, extension)
    },
};

const actions = {
    async setExtensions({commit}, value) {
        commit(types.SET_EXTENSIONS, value)
    },
    async updateExtension({commit}, value) {
        commit(types.UPDATE_EXTENSIONS, value)
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
