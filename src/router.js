import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ './views/DashboardPage.vue'),
    },
    {
        path: '/dashboard-settings',
        name: 'dashboard-settings',
        component: () => import(/* webpackChunkName: "home" */ './views/DashboardSettings/DashboardSettings.vue'),
    },
    {
        path: '/layout-settings',
        name: 'layout-settings',
        component: () => import(/* webpackChunkName: "home" */ './views/LayoutSettings/LayoutSettings.vue'),
    },
    {
        path: '/dashboard-creation',
        name: 'dashboard-creation',
        component: () => import(/* webpackChunkName: "home" */ './views/DashboardCreation/DashboardCreation.vue'),
    },
]

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
})

export default router
