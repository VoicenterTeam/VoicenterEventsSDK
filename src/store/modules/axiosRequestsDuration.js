const types = {
    SET_REQUEST_INFO: 'SET_REQUEST_INFO',
    CLEAR_REQUEST_INFO: 'CLEAR_REQUEST_INFO'
};
const state = {
    requestsInfo: []
};

const mutations = {
    [types.SET_REQUEST_INFO]: (state, data) => {
        const indexOfElement = state.requestsInfo.findIndex(el => el.url === data.url)
        if (indexOfElement !== -1) {
            state.requestsInfo[indexOfElement].duration = data.duration
        } else {
            state.requestsInfo.push(data)
        }
    },
    [types.CLEAR_REQUEST_INFO]: (state) => {
        state.requestsInfo = []
    }
};

const actions = {
    async setRequestInfo({ commit }, url) {
        commit(types.SET_REQUEST_INFO, url);
    },
    async clearRequestInfo({ commit }) {
        commit(types.CLEAR_REQUEST_INFO);
    }
};

const getters = {
    getRequestsInfo: (state) => {
        return state.requestsInfo
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
