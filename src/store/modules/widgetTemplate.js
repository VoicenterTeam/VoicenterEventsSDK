import templatesCategory from '@/store/modules/templatesCategory'

const types = {
    SET_ALL_WIDGET_TEMPLATES: 'SET_ALL_WIDGET_TEMPLATES',
};
const state = {
    allWidgetTemplates: [],
};

const mutations = {
    [types.SET_ALL_WIDGET_TEMPLATES]: (state, value) => {
        state.allWidgetTemplates = value;
    },
};

const actions = {
    async getAllWidgetTemplates({ commit }) {
        let templates = []
        try {
            templates = templatesCategory.state.all[0] || []
        } catch (e) {
            console.warn(e)
        }
        commit(types.SET_ALL_WIDGET_TEMPLATES, templates)
    },
};

const getters = {
    getWidgetTemplate: state => templateId => {
        if (!templateId) {
            return
        }
        return state.allWidgetTemplates.find(t => t.TemplateID.toString() === templateId.toString())
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
