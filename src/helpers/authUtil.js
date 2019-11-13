import store from '@/store/store'

export function authorizationData() {
    return 'Bearer ' + store.getters['users/currentUser']
}
