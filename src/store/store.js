import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import lang from './modules/lang'
import users from './modules/users'
import utils from './modules/utils'
import queues from './modules/queues'
import entities from './modules/entities'
import dashboards from './modules/dashboards'
import extensions from './modules/extensions'
import widgetTemplate from './modules/widgetTemplate'
import templatesCategory from './modules/templatesCategory'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        paths: ['users']
    })],
    modules: {
        lang,
        utils,
        users,
        queues,
        entities,
        dashboards,
        extensions,
        widgetTemplate,
        templatesCategory,
    }
})
