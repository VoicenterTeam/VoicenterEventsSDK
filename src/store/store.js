import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import dashboard from './modules/dashboard'
import widgets from './modules/widgets'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    paths: ['dashboard', 'widgets'] // add here modules or paths you want to sync in local storage
  })],
  modules: {
    dashboard,
    widgets
  }
})
