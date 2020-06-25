import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import lang from './modules/lang'
import users from './modules/users'
import utils from './modules/utils'
import layout from './modules/layout'
import entities from './modules/entities'
import dashboards from './modules/dashboards'
import widgetTemplate from './modules/widgetTemplate'
import templatesCategory from './modules/templatesCategory'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        paths: ['users', 'dashboards.activeDashboard', 'dashboards.loadingData', 'dashboards.editMode', 'layout']
    })],
    modules: {
        lang,
        utils,
        users,
        layout,
        entities,
        dashboards,
        widgetTemplate,
        templatesCategory,
    }
})
