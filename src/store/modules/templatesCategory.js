import { templateApi } from '@/api/templateApi'

const types = {
    SET_ALL_TEMPLATES_CATEGORY: 'SET_ALL_TEMPLATES_CATEGORY',
    SET_ALL_TEMPLATES_DICTIONARIES: 'SET_ALL_TEMPLATES_DICTIONARIES',
};
const state = {
    all: [],
    dictionaries: [],
};

const mutations = {
    [types.SET_ALL_TEMPLATES_CATEGORY]: (state, value) => {
        state.all = value
    },
    [types.SET_ALL_TEMPLATES_DICTIONARIES]: (state, value) => {
        state.dictionaries = value
    },
}

const actions = {
    async getAllTemplatesCategory({ commit }) {
        const templatesCategories = await templateApi.getTemplateCategories()
        commit(types.SET_ALL_TEMPLATES_CATEGORY, templatesCategories)
    },
    async getAllTemplateDictionaries({ commit }) {
        const templateDictionaries = await templateApi.getWidgetsTemplateHelps()
        commit(types.SET_ALL_TEMPLATES_DICTIONARIES, templateDictionaries)
    },
}

const getters = {
    getHelpByWidgetsTemplateID: state => TemplateID => {
        return state.allWidgetTemplates.find(t => t.TemplateID.toString() === TemplateID.toString())
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
