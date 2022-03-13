const types = {
    UPDATE_REPORT_DATA: 'UPDATE_REPORT_DATA',
    RESET_REPORT_DATA: 'RESET_REPORT_DATA'
}

const defaultReportData = {
    LayoutID: null,
    AccountID: null,
    ReportName: null,
    ReportTypeID: 1,
    ReportItemList: [],
    ReportStatusID: 0,
    ReportTriggerList: []
}


const setDefaultReportData = () => {
    return JSON.parse(JSON.stringify(defaultReportData))
}

const state = {
    reportData: setDefaultReportData()
}

const mutations = {
    [types.UPDATE_REPORT_DATA]: (state, data) => {
        Object.keys(data).forEach(el => {
            state.reportData[el] = data[el]
        })
    },
    [types.RESET_REPORT_DATA]: (state) => {
        state.reportData = setDefaultReportData()
    }
}

const actions = {
    async updateReportData({ commit }, data) {
        commit(types.UPDATE_REPORT_DATA, data)
    },
    async resetReportData({ commit }) {
        commit(types.RESET_REPORT_DATA)
    }
}

const getters = {
    getReportData: state => {
        return state.reportData
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
};
