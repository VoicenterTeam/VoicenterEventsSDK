export const types = {
    SET_USERS: 'SET_USERS',
    SET_CURRENT_USER: 'SET_CURRENT_USER',
    SET_TOKENS: 'SET_TOKENS',
    SET_TOKEN_STRING: 'SET_TOKEN_STRING',
    REMOVE_USER: 'REMOVE_USER'
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
    },
    [types.SET_CURRENT_USER]: (state, value) => {
        state.currentUser = value
    },
    [types.REMOVE_USER]: (state, value) => {
        let userIndex = state.allUsers.findIndex(u => u.id === value.id)
        if (userIndex !== -1) {
            state.allUsers.splice(userIndex, 1)
            state.tokenString = state.tokenString.replace(','+value.token,'')
            window.history.replaceState({}, "", '?token='+state.tokenString)
        }
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
        window.location.href = process.env.VUE_APP_FALLBACK_URL
    },
    selectCurrentUser({commit}, users) {
        commit(types.SET_CURRENT_USER, users)
    },
    removeUser({commit}, users) {
        commit(types.REMOVE_USER, users)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
