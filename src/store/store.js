import Vue from 'vue'
import Vuex from 'vuex'
import dashboards from './modules/dashboards'
import createPersistedState from 'vuex-persistedstate';
import widgets from './modules/widgets'
import users from './modules/users'
import charts from './modules/charts'
import settings from './modules/settings'
import lang from './modules/lang'
import extensions from './modules/extensions'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        paths: ['users', 'settings', 'extensions']
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
