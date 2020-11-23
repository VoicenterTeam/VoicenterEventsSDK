import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */ './views/Dashboard.vue')
        },
        {
            path: '/dashboard-settings',
            name: 'dashboard-settings',
            component: () => import(/* webpackChunkName: "home" */ './views/DashboardSettings/DashboardSettings.vue')
        },
        {
            path: '/layout-settings',
            name: 'layout-settings',
            component: () => import(/* webpackChunkName: "home" */ './views/LayoutSettings/LayoutSettings.vue')
        },
        {
            path: '/dashboard-creation',
            name: 'dashboard-creation',
            component: () => import(/* webpackChunkName: "home" */ './views/DashboardCreation/DashboardCreation.vue')
        },
    ]
})
