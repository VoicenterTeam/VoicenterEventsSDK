import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import dashboardPlugin from './plugins/dashboardPlugin'
import authMiddleware from './middleware/authMiddleware'
import {Notification, MessageBox} from 'element-ui';
import './registerServiceWorker'
import i18n from './i18n'

Vue.config.productionTip = false

authMiddleware(router, store)

Vue.use(dashboardPlugin)
Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.mixin({
    methods: {
        capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1)
    }
});

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
