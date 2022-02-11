import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "view" */ './views/DashboardPage.vue'),
    },
    {
        path: '/dashboard-settings',
        name: 'dashboard-settings',
        component: () => import(/* webpackChunkName: "view" */ './views/DashboardSettings/DashboardSettings.vue'),
    },
    {
        path: '/layout-settings',
        name: 'layout-settings',
        component: () => import(/* webpackChunkName: "view" */ './views/LayoutSettings/LayoutSettings.vue'),
    },
    {
        path: '/dashboard-creation',
        name: 'dashboard-creation',
        component: () => import(/* webpackChunkName: "view" */ './views/DashboardCreation/DashboardCreation.vue'),
    },
    {
        path: '/reports',
        name: 'reports',
        redirect: 'reports',
        component: () => import(/* webpackChunkName: "modules" */'@/modules/reports/ReportsLayout'),
        children: [
            {
                path: '',
                name: 'reports-list',
                component: () => import(/* webpackChunkName: "modules" */ '@/modules/reports/pages/ReportsList'),
            },
            {
                path: 'edit/:id',
                name: 'reports-edit',
                component: () => import(/* webpackChunkName: "modules" */ '@/modules/reports/pages/ReportEdit'),
            },
            {
                path: 'create',
                name: 'reports-create',
                component: () => import(/* webpackChunkName: "modules" */ '@/modules/reports/pages/ReportCreate'),
            },
        ],
    },
    /*{
        path: '/generate-pdf',
        name: 'generate-pdf',
        component: () => import(/!* webpackChunkName: "modules" *!/ '@/modules/reports/types/pdf/pdf-wrapper'),
    },*/
    {
        path: '*',
        name: 'Not Found',
        meta: {
            skipOrganizationCheck: true,
            productionReady: true,
        },
        component: () => import(/* webpackChunkName: "modules" */ '@/modules/404.vue'),
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
