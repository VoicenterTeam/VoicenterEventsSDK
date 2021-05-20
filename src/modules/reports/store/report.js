const types = {
    SET_REPORT: 'SET_REPORT',
    UPDATE_REPORT: 'UPDATE_REPORT',
}

const state = {
    data: null,
}

const mutations = {
    [types.SET_REPORT]: (state, report) => {
        state.data = report
    },
    [types.UPDATE_REPORT]: (state, report) => {
        state.data = report
    },
}

const actions = {
    async updateReportData({ commit }, report) {
        commit(types.UPDATE_REPORT, report)
    },
    async setReport({ commit }, report) {
        commit(types.UPDATE_REPORT, report)
    },
}

const getters = {
    getReportData: state => {
        return state.data
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
