import {LayoutApi} from '@/api/layoutApi'
import store from "@/store/store";
import {defaultLayout} from '@/enum/default-layout'
import {convertHex} from '@/helpers/convertHex'

const types = {
    SET_ACTIVE_LAYOUT: 'SET_ACTIVE_LAYOUT'
};
const state = {
    data: []
};

const mutations = {
    [types.SET_ACTIVE_LAYOUT]: (state, value) => {
        state.data = value;
    }
};

const actions = {
    async setLayout({commit}) {
        const dashboard = store.state.dashboards.activeDashboard
        if (dashboard) {
            const dashboardLayoutID = dashboard.DashboardLayoutID
            const data = {
                LayoutID: dashboardLayoutID
            }
            const layout = await LayoutApi.get(data)
            commit(types.SET_ACTIVE_LAYOUT, layout[0])
            return;
        }
        const layout = defaultLayout(null)
        commit(types.SET_ACTIVE_LAYOUT, layout)
    }
};
const getters = {
    colors: state => {
        let result = {
            primary: "#2575FF",
            primary_rgba: "37, 117, 255",
            background: "#edf2f7",
            frames: "#edf2f7",
            widgetGroupBackground: "#edf2f7",
            widgetGroupFrames: "#edf2f7",
            widgetGroupTitles: '#000000'
        }

        state.data.LayoutParametersList.forEach((el) => {

            if (el.LayoutParameterName === "ColorPrimary") {
                result.primary = el.Value
            }

            if (el.LayoutParameterName === "ColorBackground") {
                result.background = el.Value
            }

            if (el.LayoutParameterName === "ColorFrames") {
                result.frames = el.Value
            }

            if (el.LayoutParameterName === "ColorWidgetGroupBackground") {
                result.widgetGroupBackground = el.Value
            }

            if (el.LayoutParameterName === "ColorWidgetGroupFrames") {
                result.widgetGroupFrames = el.Value
            }

            if (el.LayoutParameterName === "ColorWidgetGroupTitles") {
                result.widgetGroupTitles = el.Value
            }
        });

        result['primary_rgba'] = convertHex(result.primary);

        return result
    },
    baseFontSize: state => {
        try {
            let result = state.data.LayoutParametersList.filter((el) => el.LayoutParameterName === 'FontSize')
            return Number(result[0]['Value'])
        } catch (e) {
            console.warn(e)
            return 16
        }
    },
    refreshDelay: state => {
        try {
            let result = state.data.LayoutParametersList.filter((el) => el.LayoutParameterName === 'RefreshRealTimeDataDelay')
            return Number(result[0]['Value'])
        } catch (e) {
            console.warn(e)
            return 30
        }
    },
    switchInterval: state => {
        try {
            let result = state.data.LayoutParametersList.filter((el) => el.LayoutParameterName === 'ReportInterval')
            return Number(result[0]['Value'])
        } catch (e) {
            console.warn(e)
            return null
        }
    },
    switchReport: state => {
        try {
            let result = state.data.LayoutParametersList.filter((el) => el.LayoutParameterName === 'ReportSwitching')
            return Boolean(result[0]['Value'] === "1");
        } catch (e) {
            console.warn(e)
            return false
        }
    },
    widgetGroupTitleStyles: state => {
        try {
            const fontSize = state.data.LayoutParametersList.filter((el) => el.LayoutParameterName === 'WidgetTitlesFontSize')
            const _fontSize = Number(fontSize[0]['Value'])
            const color = state.data.LayoutParametersList.filter((el) => el.LayoutParameterName === 'ColorWidgetGroupTitles')
            const _color = color[0]['Value']

            return {
                color: _color,
                fontSize: `${_fontSize}px`
            }
        } catch (e) {
            console.warn(e)
            return {
                color: '#000000',
                fontSize: '22px'
            }
        }
    },
    widgetTitleStyles: state => {
        try {
            const result = state.data.LayoutParametersList.filter((el) => el.LayoutParameterName === 'WidgetTitlesFontSize')
            const fontSize = Number(result[0]['Value'])
            return {
                fontSize: `${fontSize}px`
            }
        } catch (e) {
            console.warn(e)
            return {
                fontSize: '22px'
            }
        }
    },
    showWidgetTitles: state => {
        try {
            let result = state.data.LayoutParametersList.filter((el) => el.LayoutParameterName === 'ShowWidgetTitles')
            return Boolean(result[0]['Value'] === "1");
        } catch (e) {
            console.warn(e)
            return true
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
