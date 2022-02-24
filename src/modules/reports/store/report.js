const types = {
    SET_CONF_DATA: 'SET_CONF_DATA',
    UPDATE_REPORT_DATA_BY_STEP: 'UPDATE_REPORT_DATA_BY_STEP',
    UPDATE_REPORT_DATA_SCHEDULE_SETTINGS: 'UPDATE_REPORT_DATA_SCHEDULE_SETTINGS',
    CREATE_NEW_CRITERIA: 'CREATE_NEW_CRITERIA',
    CREATE_NEW_CONDITION: 'CREATE_NEW_CONDITION',
    DELETE_CONDITION: 'DELETE_CONDITION',
    DELETE_CRITERIA: 'DELETE_CRITERIA',
    UPDATE_REPORT_DATA: 'UPDATE_REPORT_DATA',
    RESET_REPORT_DATA: 'RESET_REPORT_DATA'
    
}

const defaultReportConditionData = {
    WidgetID: null,
    WidgetTemplateColumnID: null,
    ConditionFilterOperatorID: null,
    ConditionFilterColumnTypeID: null,
    ConditionFilterValue: null
}
const setDefaultReportConditionData = () => {
    return JSON.parse(JSON.stringify(defaultReportConditionData))
}
const defaultReportData = {
    ReportTriggerTypeID: null,
    ReportTriggerName: '',
    ReportID: '',
    EmailSubject: '',
    EmailBody: '',
    ReportTriggerRecipient: [],
    ScheduleData: {},
    0: [
        [
            setDefaultReportConditionData()
        ]
    ]
}

const setDefaultReportData = () => {
    return JSON.parse(JSON.stringify(defaultReportData))
}
const state = {
    confData: [],
    reportData: setDefaultReportData()
}

const mutations = {
    [types.SET_CONF_DATA]: (state, data) => {
        state.confData = data
    },
    [types.UPDATE_REPORT_DATA_BY_STEP]: (state, data) => {
        state.reportData[data.step] = data.value
    },
    [types.UPDATE_REPORT_DATA_SCHEDULE_SETTINGS]: (state, data) => {
        state.reportData.ScheduleData = data
    },
    [types.CREATE_NEW_CRITERIA]: (state, step) => {
        state.reportData[step].push(
            [
                setDefaultReportConditionData()
            ]
        )
    },
    [types.CREATE_NEW_CONDITION]: (state, data) => {
        state.reportData[data.step][data.index].push(
            setDefaultReportConditionData()
        )
    },
    [types.DELETE_CONDITION]: (state, data) => {
        state.reportData[data.step][data.groupIndex].splice(data.itemIndex, 1)
    },
    [types.DELETE_CRITERIA]: (state, data) => {
        state.reportData[data.step].splice(data.index, 1)
    },
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
    async setConfData({ commit }, data) {
        commit(types.SET_CONF_DATA, data)
    },
    async updateReportDataByStep({ commit }, data) {
        commit(types.UPDATE_REPORT_DATA_BY_STEP, data)
    },
    async updateReportDataScheduleSettings({ commit }, data) {
        commit(types.UPDATE_REPORT_DATA_SCHEDULE_SETTINGS, data)
    },
    async createNewCriteria({ commit }, step) {
        commit(types.CREATE_NEW_CRITERIA, step)
    },
    async createNewCondition({ commit }, step) {
        commit(types.CREATE_NEW_CONDITION, step)
    },
    async deleteCondition({ commit }, step) {
        commit(types.DELETE_CONDITION, step)
    },
    async deleteCriteria({ commit }, step) {
        commit(types.DELETE_CRITERIA, step)
    },
    async updateReportData({ commit }, data) {
        commit(types.UPDATE_REPORT_DATA, data)
    },
    async resetReportData({ commit }) {
        commit(types.RESET_REPORT_DATA)
    }
}

const getters = {
    getConfData: state =>  {
        return state.confData
    },
    getReportDataByStep: (state) => (numberOfStep) => {
        return state.reportData[numberOfStep]
    },
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
