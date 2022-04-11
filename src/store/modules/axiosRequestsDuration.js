const types = {
    SET_REQUEST_INFO: 'SET_REQUEST_INFO'
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
    }
};

const actions = {
    async setRequestInfo({ commit }, url) {
        commit(types.SET_REQUEST_INFO, url);
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
