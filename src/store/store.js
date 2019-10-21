import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import lang from './modules/lang'
import users from './modules/users'
import queues from './modules/queues'
import dashboards from './modules/dashboards'
import extensions from './modules/extensions'
import widgetTemplate from './modules/widgetTemplate'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        paths: ['users']
    })],
    modules: {
        dashboards,
        users,
        lang,
        extensions,
        queues,
        widgetTemplate,
    }
})
