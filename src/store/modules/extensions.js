import { ISRAEL_TIMEZONE_OFFSET } from "@/enum/generic";

const types = {
    SET_EXTENSIONS: 'SET_EXTENSIONS',
    UPDATE_EXTENSIONS: 'UPDATE_EXTENSIONS',
    SET_SERVER_TIME: 'SET_SERVER_TIME',
    SET_IS_SOCKET_OFFLINE: 'SET_IS_SOCKET_OFFLINE',
};
const state = {
    extensions: [],
    serverTime: null,
    serverDelta: 0,
    isSocketOffline: false,
    offlineSocketTimestamp: null
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
    },
    [types.SET_IS_SOCKET_OFFLINE]: (state, value) => {
        state.isSocketOffline = value
        if (value) {
            state.offlineSocketTimestamp = new Date().getTime()
        } else {
            state.offlineSocketTimestamp = null
        }
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