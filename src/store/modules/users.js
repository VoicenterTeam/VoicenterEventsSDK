export const types = {
    SET_USERS: 'SET_USERS',
    SET_CURRENT_USER: 'SET_CURRENT_USER',
    SET_TOKENS: 'SET_TOKENS',
    SET_TOKEN_STRING: 'SET_TOKEN_STRING',
}
const state = {
    allUsers: [],
    currentUser: {},
    tokens: null,
    tokenString: null
}
const mutations = {
    [types.SET_USERS]: (state, value) => {
        state.allUsers = value
        if (value && value.length && Object.keys(state.currentUser).length === 0) {
            state.currentUser = value[0]
            value[0].primary = true
            state.allUsers = value
        }
    },
    [types.SET_CURRENT_USER]: (state, value) => {
        state.currentUser = value
    },
    [types.SET_TOKENS]: (state, value) => {
        state.tokens = value
    },
    [types.SET_TOKEN_STRING]: (state, value) => {
        state.tokenString = value
    }
}
const actions = {
    logout({commit}) {
        localStorage.clear()
        commit(types.SET_USERS, [])
        commit(types.SET_CURRENT_USER, {})
        commit(types.SET_TOKENS, null)
        commit(types.SET_TOKEN_STRING, null)
    },
    selectCurrentUser({commit}, users) {
        commit(types.SET_CURRENT_USER, users)
    },
}

const getters = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
