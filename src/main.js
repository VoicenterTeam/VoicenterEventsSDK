import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dashboardPlugin from './plugins/dashboardPlugin'
import './registerServiceWorker'
Vue.config.productionTip = false

Vue.use(dashboardPlugin)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
