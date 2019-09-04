import {getSettings} from '@/services/settingsService'
import convertHex from "@/helpers/convertHex";


const types = {
    SET_SETTING: 'SET_SETTING',
    UPDATE_SETTING: 'UPDATE_SETTING'
};
const state = {
    report: {},
    colors: {},
    threshold: {},
    showLoggedOutUsers: true
};

function fetchSettingsData(settings) {
    settings.colors.primary_rgba = convertHex(settings.colors.primary)
    return settings
}

const mutations = {
    [types.SET_SETTING]: (stat, settings) => {
        state.report = {...settings.report};
        state.colors = {...settings.colors};
        state.threshold = {...settings.threshold};
        state.showLoggedOutUsers = settings.showLoggedOutUsers;
    },
    [types.UPDATE_SETTING]: (state, settings) => {
        state.report = {...settings.report};
        state.colors = {...settings.colors};
        state.threshold = {...settings.threshold};
        state.showLoggedOutUsers = settings.showLoggedOutUsers;
    },
};

const actions = {
    async setSettings({commit}) {
        let settings = await getSettings()
        commit(types.SET_SETTING, settings)
    },
    async update({commit}, settings) {

        settings = fetchSettingsData(settings)

        commit(types.UPDATE_SETTING, settings)
    }
};

const getters = {};

export default {
    namespaced: true,
    types,
    state,
    mutations,
    actions,
    getters
};
