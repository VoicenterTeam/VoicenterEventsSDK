import {getWidgets} from '@/services/widgetService'

const types = {
    SET_ALL_WIDGETS: 'SET_ALL_WIDGETS'
};
const state = {
    allWidgets: {}
};

const mutations = {
    [types.SET_ALL_WIDGETS]: (state, value) => {
        state.allWidgets = value;
    }
};

const actions = {
    async getAllWidgets({commit}) {
        const widgets = await getWidgets()
        commit(types.SET_ALL_WIDGETS, widgets)
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
