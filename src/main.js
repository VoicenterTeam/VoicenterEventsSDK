import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import dashboardPlugin from './plugins/dashboardPlugin'
import authMiddleware from './middleware/authMiddleware'
import {Notification, MessageBox} from 'element-ui';
import './registerServiceWorker'
import i18n from './i18n'
import initRealTimeSdk from "@/plugins/initRealTimeSdk";
import PortalVue from 'portal-vue'

Vue.config.productionTip = false

authMiddleware(router, store)

Vue.use(PortalVue)
Vue.use(dashboardPlugin)
Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

initRealTimeSdk().then(() => {
    console.log('Real time SDK Initialized')
})
