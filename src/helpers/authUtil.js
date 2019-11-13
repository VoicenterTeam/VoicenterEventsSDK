const persistentData = JSON.parse(localStorage.getItem('vuex'))

export function autorizationData() {
    let userData = persistentData.users

    if (userData && userData.tokens) {
        // TODO: define with backend type of data
        return 'Bearer ' + JSON.stringify(userData.tokens)
    }
    return ''
}
