const types = {
    UPDATE_REPORT_DATA: 'UPDATE_REPORT_DATA',
    RESET_REPORT_DATA: 'RESET_REPORT_DATA',
    PUSH_REPORT_TRIGGER_DATA: 'PUSH_REPORT_TRIGGER_DATA',
    DELETE_REPORT_TRIGGER_ITEM: 'DELETE_REPORT_TRIGGER_ITEM',
    UPDATE_REPORT_TRIGGER_ITEM: 'UPDATE_REPORT_TRIGGER_ITEM'
}

const defaultReportData = {
    LayoutID: null,
    AccountID: null,
    ReportName: null,
    ReportTypeID: 1,
    ReportItemList: [
        {
           "ReportID":10,
           "WidgetID":37678,
           "WidgetTitle":"Table - User Performance",
           "ReportItemID":97,
           "ReportItemData":{
              
           },
           "ReportItemName":"item1",
           "ReportItemOrder":1,
           "ReportItemExport":[
              {
                 "ReportItem":97,
                 "ReportExportOrder":1,
                 "ReportExportTypeID":2,
                 "ReportItemExportID":3,
                 "ReportExportTypeName":"PDF"
              }
           ],
           "WidgetTemplateID":1,
           "ReportItemStatusID":2,
           "ReportItemStatusName":"disable",
           "ReportItemDescription":"zzz"
        },
        {
           "ReportID":10,
           "WidgetID":37704,
           "WidgetTitle":"Total leads today ",
           "ReportItemID":99,
           "ReportItemData":{
              
           },
           "ReportItemName":"xxx",
           "ReportItemOrder":2,
           "ReportItemExport":[
              {
                 "ReportItem":99,
                 "ReportExportOrder":1,
                 "ReportExportTypeID":2,
                 "ReportItemExportID":100,
                 "ReportExportTypeName":"PDF"
              }
           ],
           "WidgetTemplateID":105,
           "ReportItemStatusID":1,
           "ReportItemStatusName":"enable",
           "ReportItemDescription":"xxx"
        },
        {
           "ReportID":10,
           "WidgetID":37702,
           "WidgetTitle":"Total leads sold today",
           "ReportItemID":102,
           "ReportItemData":{
              
           },
           "ReportItemName":"yyy",
           "ReportItemOrder":3,
           "ReportItemExport":[
              {
                 "ReportItem":102,
                 "ReportExportOrder":1,
                 "ReportExportTypeID":2,
                 "ReportItemExportID":103,
                 "ReportExportTypeName":"PDF"
              }
           ],
           "WidgetTemplateID":102,
           "ReportItemStatusID":1,
           "ReportItemStatusName":"enable",
           "ReportItemDescription":"yyy"
        },
        {
           "ReportID":10,
           "WidgetID":392,
           "WidgetTitle":"Realtime call cards",
           "ReportItemID":145,
           "ReportItemData":{
              
           },
           "ReportItemName":"NewItem2",
           "ReportItemOrder":1,
           "ReportItemExport":[
              {
                 "ReportItem":145,
                 "ReportExportOrder":10,
                 "ReportExportTypeID":2,
                 "ReportItemExportID":145,
                 "ReportExportTypeName":"PDF"
              }
           ],
           "WidgetTemplateID":5,
           "ReportItemStatusID":1,
           "ReportItemStatusName":"enable",
           "ReportItemDescription":"This item report..."
        },
        {
           "ReportID":10,
           "WidgetID":37678,
           "WidgetTitle":"Table - User Performance",
           "ReportItemID":160,
           "ReportItemData":{
              
           },
           "ReportItemName":"Zupa",
           "ReportItemOrder":1,
           "ReportItemExport":[
              {
                 "ReportItem":160,
                 "ReportExportOrder":10,
                 "ReportExportTypeID":2,
                 "ReportItemExportID":220,
                 "ReportExportTypeName":"PDF"
              }
           ],
           "WidgetTemplateID":1,
           "ReportItemStatusID":1,
           "ReportItemStatusName":"enable",
           "ReportItemDescription":"This item report..."
        }
    ],
    ReportStatusID: false,
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
