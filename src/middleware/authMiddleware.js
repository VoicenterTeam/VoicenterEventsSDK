import jwtDecode from 'jwt-decode'
import {types} from '../store/modules/users'

export function redirectToLogin() {
    window.location.href = process.env.VUE_APP_FALLBACK_URL
}

function getTokens(to, store) {
    let tokensString = to.query.token || store.state.users.tokenString || ''
    return {
        tokens: tokensString.split(','),
        tokensString
    }
}

function isTokenExpired(exp) {
    let expireDate = new Date(exp * 1000)
    let now = new Date()
    return expireDate.getTime() < now.getTime()
}

function decodeTokens(tokens) {
    return tokens.map(t => {
        return {
            ...jwtDecode(t),
            token: t,
        }
    })
}

function filterExpiredTokens(tokens) {
    // TODO: check token str : {"id": 123,"sub": "1234567890","name": "John Doe","iat": 1516239022,"exp": 1563341875}
    return tokens.filter(t => !isTokenExpired(t.exp))
}

export default function authMiddleware(router, store) {

    router.beforeEach((to, from, next) => {
        let {tokens, tokensString} = getTokens(to, store)
        if (!tokens) {
            return redirectToLogin(next)
        }

        try {
            // TODO: define flow with back-end
            // let validTokens = filterExpiredTokens(decodeTokens(tokens))
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
