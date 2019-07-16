import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import dashboards from './modules/dashboards'
import widgets from './modules/widgets'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        paths: ['dashboards', 'widgets', 'users'] // add here modules or paths you want to sync in local storage
    })],
    modules: {
        dashboards,
        widgets,
        users
    }
})
