import en from 'element-ui/lib/locale/lang/en'
import he from 'element-ui/lib/locale/lang/he'
import locale from 'element-ui/lib/locale'
import get from 'lodash/get'
import Vue from 'vue'
import { LanguageApi, ContentsApi } from '@/api/languageApi'

function setElementLocale(lang) {
    locale.use(lang === 'he' ? he : en)
}

const types = {
    SET_LANG_LIST: 'SET_LANG_LIST',
    SET_TRANSLATIONS: 'SET_TRANSLATIONS'
};
const state = {
    languages: [],
    translations: []
};

const mutations = {
    [types.SET_LANG_LIST]: (state, languages) => {
        state.languages = languages
    },
    [types.SET_TRANSLATIONS]: (state, value) => {
        state.translations = value
    }
};

const actions = {
    async getLanguages({ commit }) {
        const languages = await LanguageApi.getAll()

        commit(types.SET_LANG_LIST, languages)
    },
    async setLanguage({ commit }, lang) {
        const dir = get(lang, 'DomainConfig.Direction', 'ltr')
        const locale = lang.locale

        if (dir === 'rtl') {
            Vue.prototype.$rtl.enableRTL()
        }
        const translations = await ContentsApi.getAll()
        commit(types.SET_TRANSLATIONS, translations);

        setElementLocale(locale)
    }
};

const getters = {
    getActiveLanguageID: (state, getter) => {
        return getter.getActiveLanguage.LanguageID
    },
    getActiveLanguage: (state, getters) => {
        const currentDomain = window.location.hostname === 'localhost'?
            process.env.VUE_APP_DEFAULT_DOMAIN_NAME:
            window.location.hostname

        return getters.getLanguageList.find(language => {
            return language.Domain === currentDomain
        })
    },
    getLanguageList: state => {
        return state.languages.map(language => {
            const [locale, iconName] = language.LanguageCode.split('-')

            return {
                ...language,
                abbName: locale.toUpperCase(),
                locale,
                name: language.LanguageName,
                icon: `/img/flags/${iconName}.png`
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
