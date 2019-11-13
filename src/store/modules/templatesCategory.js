import {templateCategoryApi} from '@/api/templateCategoryApi'

const types = {
    SET_ALL_TEMPLATES_CATEGORY: 'SET_ALL_TEMPLATES_CATEGORY'
};
const state = {
    all: []
};

const mutations = {
    [types.SET_ALL_TEMPLATES_CATEGORY]: (state, value) => {
        state.all = value;
    }
};

const actions = {
    async getAllTemplatesCategory({commit}) {
        let templatesCategories = await templateCategoryApi.getAll()
        commit(types.SET_ALL_TEMPLATES_CATEGORY, templatesCategories)
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
