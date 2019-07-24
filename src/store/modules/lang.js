const types = {
    SET_LANG: 'SET_LANG',
};
const state = {
    language: {},
};

const mutations = {
    [types.SET_LANG]: (stat, lang) => {
        state.language = lang
    },
};

const actions = {
    async setLanguage({commit}, lang) {
        commit(types.SET_LANG, lang)
    },
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
