const types = {
    SET_CONF_DATA: 'SET_CONF_DATA',
    UPDATE_REPORT_DATA_BY_STEP: 'UPDATE_REPORT_DATA_BY_STEP',
    UPDATE_REPORT_DATA_SCHEDULE_SETTINGS: 'UPDATE_REPORT_DATA_SCHEDULE_SETTINGS',
    CREATE_NEW_CRITERIA: 'CREATE_NEW_CRITERIA',
    CREATE_NEW_CONDITION: 'CREATE_NEW_CONDITION',
    DELETE_CONDITION: 'DELETE_CONDITION',
    DELETE_CRITERIA: 'DELETE_CRITERIA',
    UPDATE_REPORT_DATA: 'UPDATE_REPORT_DATA',
    RESET_REPORT_DATA: 'RESET_REPORT_DATA',
    UPDATE_CREATE_LOCAL_REPORT_TRIGGER: 'UPDATE_CREATE_LOCAL_REPORT_TRIGGER',
    UPDATE_REPORT_TRIGGER_CONDITION: 'UPDATE_REPORT_TRIGGER_CONDITION'
    
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
const defaultReportTriggerData = {
    ReportTriggerTypeID: null,
    ReportTriggerName: '',
    ReportID: '',
    EmailSubject: '',
    EmailBody: '',
    ReportTriggerRecipient: [],
    ScheduleData: {},
    ReportTriggerCondition: [
        {
            ReportTriggerConditionFilter: [
                setDefaultReportConditionData()
            ]
        }
    ]
}

const setDefaultReportTriggerData = () => {
    return JSON.parse(JSON.stringify(defaultReportTriggerData))
}
const state = {
    confData: [],
    reportTriggerData: setDefaultReportTriggerData(),
    createLocalReportTrigger: false
}

const mutations = {
    [types.SET_CONF_DATA]: (state, data) => {
        state.confData = data
    },
    [types.UPDATE_REPORT_DATA_BY_STEP]: (state, data) => {
        state.reportTriggerData[data.step] = data.value
    },
    [types.UPDATE_REPORT_DATA_SCHEDULE_SETTINGS]: (state, data) => {
        state.reportTriggerData.ScheduleData = data
    },
    [types.CREATE_NEW_CRITERIA]: (state, step) => {
        state.reportTriggerData[step].push(
            {
                ReportTriggerConditionFilter: [
                    setDefaultReportConditionData()
                ]
            }
        )
    },
    [types.CREATE_NEW_CONDITION]: (state, data) => {
        state.reportTriggerData[data.step][data.index].ReportTriggerConditionFilter.push(
            setDefaultReportConditionData()
        )
    },
    [types.DELETE_CONDITION]: (state, data) => {
        state.reportTriggerData[data.step][data.groupIndex].ReportTriggerConditionFilter.splice(data.itemIndex, 1)
    },
    [types.DELETE_CRITERIA]: (state, data) => {
        state.reportTriggerData[data.step].splice(data.index, 1)
    },
    [types.UPDATE_REPORT_DATA]: (state, data) => {
        Object.keys(data).forEach(el => {
            state.reportTriggerData[el] = data[el]
        })
    },
    [types.RESET_REPORT_DATA]: (state) => {
        state.reportTriggerData = setDefaultReportTriggerData()
    },
    [types.UPDATE_CREATE_LOCAL_REPORT_TRIGGER]: (state, value) => {
        state.createLocalReportTrigger = value
    },
    [types.UPDATE_REPORT_TRIGGER_CONDITION]: (state) => {
        state.reportTriggerData.ReportTriggerCondition = [
            {
                ReportTriggerConditionFilter: [
                    setDefaultReportConditionData()
                ]
            }
        ]
    }
}

const actions = {
    async setConfData({ commit }, data) {
        commit(types.SET_CONF_DATA, data)
    },
    async updateReportTriggerDataByStep({ commit }, data) {
        commit(types.UPDATE_REPORT_DATA_BY_STEP, data)
    },
    async updateReportTriggerDataScheduleSettings({ commit }, data) {
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
    async updateReportTriggerData({ commit }, data) {
        commit(types.UPDATE_REPORT_DATA, data)
    },
    async resetReportTriggerData({ commit }) {
        commit(types.RESET_REPORT_DATA)
    },
    async updateValueOfCreateLocalReportTrigger({ commit }, value) {
        commit(types.UPDATE_CREATE_LOCAL_REPORT_TRIGGER, value)
    },
    async updateReportTriggerCondition({ commit }) {
        commit(types.UPDATE_REPORT_TRIGGER_CONDITION)
    }
}

const getters = {
    getConfData: state =>  {
        return state.confData
    },
    getReportTriggerDataByStep: (state) => (numberOfStep) => {
        return state.reportTriggerData[numberOfStep]
    },
    getReportTriggerData: state => {
        return state.reportTriggerData
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
};
