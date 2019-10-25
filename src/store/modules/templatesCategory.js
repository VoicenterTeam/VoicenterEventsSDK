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
    getAllTemplatesCategory({commit}) {
        let templatesCategories = templateCategoryApi.getAll()
        commit(types.SET_ALL_TEMPLATES_CATEGORY, templatesCategories)
    }
};

export default {
    namespaced: true,
    types,
    state,
    mutations,
    actions,
};
