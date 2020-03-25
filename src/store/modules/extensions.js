import { ISRAEL_TIMEZONE_OFFSET, MINUTE } from "@/enum/generic";

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
    serverOffset: 0,
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
        state.serverOffset = value.servertimeoffset * 60 * 1000 || ISRAEL_TIMEZONE_OFFSET
        state.serverTime = value.servertime * 1000 - state.serverOffset
        state.serverDelta = new Date().getTime() - state.serverTime
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

const getters = {
    isSocketOffline: state => {
        if (!state.offlineSocketTimestamp || isNaN(state.offlineSocketTimestamp)) {
            return false
        }
        const now = new Date().getTime()
        // show after 1 minute of disconnect
        return state.isSocketOffline && now - state.offlineSocketTimestamp > MINUTE
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
