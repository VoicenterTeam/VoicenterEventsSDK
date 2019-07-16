import jwtDecode from 'jwt-decode'
import {types} from '../store/modules/users'

export function redirectToLogin() {
    window.location.href = process.env.VUE_APP_REDIRECT_URL
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
            primary: false
        }
    })
}

function filterExpiredTokens(tokens) {
    //TODO: check token str
    // {
    //     "sub": "1234567890",
    //     "name": "John Doe 11111",
    //     "exp": 1563341875
    // }
    return tokens.filter(t => !isTokenExpired(t.exp))
}

export default function authMiddleware(router, store) {

    router.beforeEach((to, from, next) => {
        let {tokens, tokensString} = getTokens(to, store)
        if (!tokens) {
            return redirectToLogin(next)
        }
        try {
            let validTokens = filterExpiredTokens(decodeTokens(tokens))

            if (validTokens.length === 0) {
                store.dispatch('users/logout')
                // return redirectToLogin(next)
            }

            store.commit(`users/${types.SET_USERS}`, validTokens)
            store.commit(`users/${types.SET_TOKENS}`, tokens)
            store.commit(`users/${types.SET_TOKEN_STRING}`, tokensString)
            return next()
        } catch (err) {
            console.log(err)
            // redirectToLogin(next)
        }
    })
}
