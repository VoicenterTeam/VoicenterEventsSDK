import en from 'element-ui/lib/locale/lang/en'
import he from 'element-ui/lib/locale/lang/he'
import locale from 'element-ui/lib/locale'
import get from 'lodash/get'
import { LanguageApi } from '@/api/languageApi'
import Vue from 'vue'

function setElementLocale(lang) {
    locale.use(lang === 'he' ? he : en)
}

const types = {
    SET_LANG_LIST: 'SET_LANG_LIST'
};
const state = {
    languages: []
};

const mutations = {
    [types.SET_LANG_LIST]: (state, languages) => {
        state.languages = languages
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
        // TODO: need to set i18n relevant language, for some reason cannot access i18n in this point, not even sure if we need it as there is no logic to set the translations which we got from API to i18n (Орест, сорі, робив шо міг, то вже 20:51, мене змусили пити наливку, я не хотів, нє сєрчай, зробив шо міг... :с )
        setTimeout(() => {
            console.log(Vue.prototype)
        }, 2000)
        Vue.prototype.$i18n.locale = locale

        setElementLocale(locale)
    }
};

const getters = {
    getActiveLanguageID: (state, getter) => {
        return getter.getActiveLanguage.LanguageID
    },
    getActiveLanguage: (state, getters) => {
        return getters.getLanguageList.find(language => {
            return language.Domain === window.location.hostname
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
