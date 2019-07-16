import {getCharts} from '@/services/chartService'
import Vue from 'vue'

const types = {
    SET_ALL_CHARTS: 'SET_ALL_CHARTS',
    UPDATE_CHART: 'UPDATE_CHART'
};
const state = {
    allCharts: {}
};

const mutations = {
    [types.SET_ALL_CHARTS]: (state, value) => {
        state.allCharts = value;
    },
    [types.UPDATE_CHART]: (state, chart) => {
        Vue.set(state.allCharts, chart.chart.index, chart.chart)
    },
};

const actions = {
    async getAllCharts({commit}) {
        const charts = await getCharts()
        commit(types.SET_ALL_CHARTS, charts)
    },
    async updateChart({commit}, chart) {
        commit(types.UPDATE_CHART, {chart})
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
