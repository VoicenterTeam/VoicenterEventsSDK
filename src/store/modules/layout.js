import {LayoutApi} from '@/api/layoutApi'

const types = {
    SET_ACTIVE_LAYOUT: 'SET_ACTIVE_LAYOUT'
};
const state = {
    data: []
};

const mutations = {
    [types.SET_ACTIVE_LAYOUT]: (state, value) => {
        state.data = value;
    }
};

const actions = {

};

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
