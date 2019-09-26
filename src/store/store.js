import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import lang from './modules/lang'
import users from './modules/users'
import queues from './modules/queues'
import widgets from './modules/widgets'
import dashboards from './modules/dashboards'
import extensions from './modules/extensions'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        paths: ['users']
    })],
    modules: {
        dashboards,
        widgets,
        users,
        lang,
        extensions,
        queues
    }
})
