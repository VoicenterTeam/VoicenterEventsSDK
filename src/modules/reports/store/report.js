import {reportApi} from '@/modules/reports/services/reportService'

const types = {
    RESET_DATA: 'RESET_DATA',
    SET_REPORTS: 'SET_REPORTS',
    UPDATE_REPORT: 'UPDATE_REPORT',
}

const state = {
    all: null,
    current: null,
}

const mutations = {
    [types.SET_REPORTS]: (state, reports) => {
        state.all = reports
    },
    [types.UPDATE_REPORT]: (state, report) => {
        state.current = report
    },
}

const actions = {
    async updateReport({ commit, state }, report) {
        commit(types.UPDATE_REPORT, report)
    },
    async setReport({ commit }, report) {
        commit(types.UPDATE_REPORT, report)
    },
    async getReports({ commit }) {
        try {
            const reports = await reportApi.list()
            commit(types.SET_REPORTS, reports)
            return reports
        } catch (e) {
            console.warn(e)
        }
    }
}

const getters = {
    getReportData: state => {
        return state.current
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
