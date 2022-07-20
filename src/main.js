import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'
import store from './store/store'
import authMiddleware from './middleware/authMiddleware'
import { MessageBox } from 'element-ui';
import './registerServiceWorker'
import i18n from './i18n'

import initRealTimeSdk from '@/plugins/initRealTimeSdk';
import PortalVue from 'portal-vue'
import dashboardPlugin from './plugins/dashboardPlugin'
import '@/assets/css/icon-vc.css'

Vue.config.productionTip = false

authMiddleware(router, store)

Vue.use(PortalVue)
Vue.use(VueRouter)
Vue.use(dashboardPlugin)

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$showReports = !Number.isNaN(parseInt(process.env.VUE_APP_SHOW_REPORTS)) && parseInt(process.env.VUE_APP_SHOW_REPORTS)

new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount('#app')

initRealTimeSdk().then(() => {
    console.log('Real time SDK Initialized')
})
