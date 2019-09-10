import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import lang from './modules/lang'
import users from './modules/users'
import charts from './modules/charts'
import widgets from './modules/widgets'
import settings from './modules/settings'
import dashboards from './modules/dashboards'
import extensions from './modules/extensions'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        paths: ['users', 'settings']
    })],
    modules: {
        dashboards,
        widgets,
        charts,
        users,
        settings,
        lang,
        extensions
    }
})
