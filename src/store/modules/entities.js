import {entitiesApi} from '@/api/entitiesApi'

const types = {
    SET_ENTITIES_LIST: 'SET_ENTITIES_LIST'
};
const state = {
    entitiesList: []
};

const mutations = {
    [types.SET_ENTITIES_LIST]: (state, value) => {
        state.entitiesList = value;
    }
};

const actions = {
    async getEntitiesList({commit}) {
        let entities = await entitiesApi.getList()
        commit(types.SET_ENTITIES_LIST, entities)
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
