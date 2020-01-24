import get from 'lodash/get'
import {entitiesApi} from '@/api/entitiesApi'
const types = {
    SET_ENTITIES_LIST: 'SET_ENTITIES_LIST',
    SET_SELECTED_ACCOUNT_ID: 'SET_SELECTED_ACCOUNT_ID'
};
const state = {
    entitiesList: [],
    selectedAccountID: 1
};

const mutations = {
    [types.SET_ENTITIES_LIST]: (state, value) => {
        state.entitiesList = value;
    },
    [types.SET_SELECTED_ACCOUNT_ID]: (state, value) => {
        state.selectedAccountID = value
    }
};

const actions = {
    async getEntitiesList({commit, getters}) {
        let entities = await entitiesApi.getList()
        commit(types.SET_ENTITIES_LIST, entities)
        commit(types.SET_SELECTED_ACCOUNT_ID, get(getters.accountsList, '[0].ID', 1))
    }
};

const getters = {
    // getWidgetTemplate: state => templateId => {
    //     return state.allWidgetTemplates.find(t => t.TemplateID.toString() === templateId.toString())
    // }
    getEntityList: state => list => state.entitiesList[list],
    accountsList: state => {
        let accounts = get(state, 'entitiesList.Accounts', [])
        if (accounts.length === 0) {
            accounts.push({
                name: 'Account',
                ID: 1
            })
            return accounts
        }
        return accounts.map(a => {
            return {
                name: a.dist_name,
                ID: a.distributor_id
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
