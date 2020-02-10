import { ISRAEL_TIMEZONE_OFFSET } from "@/enum/generic";

const types = {
    SET_EXTENSIONS: 'SET_EXTENSIONS',
    UPDATE_EXTENSIONS: 'UPDATE_EXTENSIONS',
    SET_SERVER_TIME: 'SET_SERVER_TIME',
};
const state = {
    extensions: [],
    serverTime: null,
    serverDelta: 0,
};

const mutations = {
    [types.SET_EXTENSIONS]: (state, value) => {
        state.extensions = value
    },
    [types.UPDATE_EXTENSIONS]: (state, {index, extension}) => {
        state.extensions.splice(index, 1, extension)
    },
    [types.SET_SERVER_TIME]: (state, value) => {
        state.serverTime = value * 1000 - ISRAEL_TIMEZONE_OFFSET
        state.serverDelta = state.serverTime - new Date().getTime()
    }
};

const actions = {
    async setExtensions({commit}, value) {
        commit(types.SET_EXTENSIONS, value)
    },
    async updateExtension({commit}, value) {
        commit(types.UPDATE_EXTENSIONS, value)
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
