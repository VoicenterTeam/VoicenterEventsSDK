import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import dashboardPlugin from './plugins/dashboardPlugin'
import './registerServiceWorker'
import i18n from './i18n'
Vue.config.productionTip = false

Vue.use(dashboardPlugin)
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
