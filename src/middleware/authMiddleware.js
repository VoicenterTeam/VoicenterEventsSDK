import { types } from '@/store/modules/users'

export function redirectToLogin() {
    window.location.href = process.env.VUE_APP_FALLBACK_URL
}

function getTokens(to, store) {
    let tokensString = to.query.token || store.state.users.tokenString || ''
    return {
        tokens: tokensString.split(','),
        tokensString,
    }
}

export default function authMiddleware(router, store) {
    
    router.beforeEach((to, from, next) => {
        let { tokens, tokensString } = getTokens(to, store)
        if (!tokens) {
            return redirectToLogin(next)
        }
        let activeTokens = store.getters['users/activeTokens']
        
        if (tokensString !== activeTokens) {
            store.commit('dashboards/RESET_ACTIVE_DASHBOARD')
            localStorage.clear()
        }
        
        try {
            if (tokens.length === 0) {
                store.dispatch('users/logout')
                return redirectToLogin(next)
            }
            
            store.commit(`users/${types.SET_USERS}`, tokens)
            store.commit(`users/${types.SET_CURRENT_USER}`, tokens[0])
            store.commit(`users/${types.SET_TOKENS}`, tokens)
            store.commit(`users/${types.SET_TOKEN_STRING}`, tokensString)
            return next()
        } catch (err) {
            redirectToLogin(next)
        }
    })
}
