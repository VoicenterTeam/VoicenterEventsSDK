import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import lang from './modules/lang'
import users from './modules/users'
import utils from './modules/utils'
import entities from './modules/entities'
import dashboards from './modules/dashboards'
import widgetTemplate from './modules/widgetTemplate'
import templatesCategory from './modules/templatesCategory'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        paths: ['users', 'dashboards.activeDashboard', 'dashboards.loadingData', 'dashboards.editMode', 'dashboards.settings']
    })],
    modules: {
        lang,
        utils,
        users,
        entities,
        dashboards,
        widgetTemplate,
        templatesCategory,
    }
})
