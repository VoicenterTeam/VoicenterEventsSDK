const types = {
    UPDATE_REPORT_DATA: 'UPDATE_REPORT_DATA',
    RESET_REPORT_DATA: 'RESET_REPORT_DATA',
    PUSH_REPORT_TRIGGER_DATA: 'PUSH_REPORT_TRIGGER_DATA',
    DELETE_REPORT_TRIGGER_ITEM: 'DELETE_REPORT_TRIGGER_ITEM',
    UPDATE_REPORT_TRIGGER_ITEM: 'UPDATE_REPORT_TRIGGER_ITEM',
    DELETE_REPORT_ITEM_LIST: 'DELETE_REPORT_ITEM_LIST',
    PUSH_REPORT_ITEM_LIST: 'PUSH_REPORT_ITEM_LIST',
    PUSH_REPORT_ITEM_EXPORT: 'PUSH_REPORT_ITEM_EXPORT',
    DELETE_REPORT_ITEM_EXPORT: 'DELETE_REPORT_ITEM_EXPORT'
}

const defaultReportData = {
    LayoutID: null,
    AccountID: null,
    ReportName: null,
    ReportTypeID: 1,
    ReportItemList: [],
    ReportStatusID: 2,
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
    },
    [types.PUSH_REPORT_TRIGGER_DATA]: (state, data) => {
        state.reportData.ReportTriggerList.push(data)
    },
    [types.DELETE_REPORT_TRIGGER_ITEM]: (state, index) => {
        state.reportData.ReportTriggerList.splice(index, 1)
    },
    [types.UPDATE_REPORT_TRIGGER_ITEM]: (state, data) => {
        Object.keys(state.reportData.ReportTriggerList[data.indexToEdit]).forEach(el => {
            state.reportData.ReportTriggerList[data.indexToEdit][el] = data.value[el]
        })
    },
    [types.DELETE_REPORT_ITEM_LIST]: (state, index) => {
        state.reportData.ReportItemList.splice(index, 1)
    },
    [types.PUSH_REPORT_ITEM_LIST]: (state, data) => {
        state.reportData.ReportItemList.push(data)
    },
    [types.PUSH_REPORT_ITEM_EXPORT]: (state, data) => {
        state.reportData.ReportItemList[data.index].ReportItemExport.push(data.data)
    },
    [types.DELETE_REPORT_ITEM_EXPORT]: (state, data) => {
        state.reportData.ReportItemList[data.index].ReportItemExport.splice(data.indexColumn, 1)
    }
}

const actions = {
    async updateReportData({ commit }, data) {
        commit(types.UPDATE_REPORT_DATA, data)
    },
    async resetReportData({ commit }) {
        commit(types.RESET_REPORT_DATA)
    },
    async pushReportTriggerData({ commit }, data) {
        commit(types.PUSH_REPORT_TRIGGER_DATA, data)
    },
    async deleteReportTriggerItem({ commit }, index) {
        commit(types.DELETE_REPORT_TRIGGER_ITEM, index)
    },
    async updateReportTriggerItem({ commit }, data) {
        commit(types.UPDATE_REPORT_TRIGGER_ITEM, data)
    },
    async deleteReportItemList({ commit }, index) {
        commit(types.DELETE_REPORT_ITEM_LIST, index)
    },
    async pushReportItemList({ commit }, data) {
        commit(types.PUSH_REPORT_ITEM_LIST, data)
    },
    async pushReportItemExport({ commit }, data) {
        commit(types.PUSH_REPORT_ITEM_EXPORT, data)
    },
    async deleteReportItemExport({ commit }, data) {
        commit(types.DELETE_REPORT_ITEM_EXPORT, data)
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
