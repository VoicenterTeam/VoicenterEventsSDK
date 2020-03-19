// element ui language configuration
import en from 'element-ui/lib/locale/lang/en'
import he from 'element-ui/lib/locale/lang/he'
import locale from 'element-ui/lib/locale'
const lang = localStorage.getItem('locale',) || 'en'

function setElementLocale(lang) {
    locale.use(lang === 'he' ? he : en)
}
setElementLocale(lang)
const types = {
    SET_LANG: 'SET_LANG',
};
const state = {
    language: localStorage.getItem('locale',) || 'en',
};

const mutations = {
    [types.SET_LANG]: (stat, lang) => {
        state.language = lang
    },
};

const actions = {
    async setLanguage({commit}, lang) {
        commit(types.SET_LANG, lang)
        localStorage.setItem('locale', lang)
        setElementLocale(lang)
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
