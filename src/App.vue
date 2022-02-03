<template>
<div id="app">
    <network-status-alert/>
    <notifications/>
    <fade-transition mode="out-in" :duration="100">
        <router-view
            v-loading.fullscreen.lock="isContentLoading"
            element-loading-background="rgba(0, 0, 0, 0.2)" />
    </fade-transition>
</div>
</template>
<script>
import globalMixin from '@/mixins/globalMixin'
import pageSizeMixin from '@/mixins/pageSizeMixin'
import { defaultFontSize } from '@/enum/defaultDashboardSettings'
import NetworkStatusAlert from '@/components/Common/NetworkStatusAlert'

export default {
    mixins: [globalMixin, pageSizeMixin],
    components: {
        NetworkStatusAlert,
    },
    async created() {
        try {
            await this.$store.dispatch('dashboards/setContentLoading', true)

            await this.$store.dispatch('lang/getLanguages')

            await this.$store.dispatch('lang/setLanguage', this.$store.getters['lang/getActiveLanguage'])
            await this.$store.dispatch('entities/getEntitiesList')
            await this.$store.dispatch('dashboards/getDashboards')
            await this.$store.dispatch('templatesCategory/getAllTemplatesCategory')

            if (!this.activeDashboard) {
                await this.$store.dispatch('dashboards/selectDashboard')
            } else {
                const dashboardExist = this.allDashboards.some(dashboard => {
                    return dashboard.DashboardID === this.activeDashboard.DashboardID
                })

                if (dashboardExist) {
                    await this.$store.dispatch('dashboards/selectDashboard')
                } else {
                    await this.$store.dispatch('dashboards/selectDashboard', this.allDashboards[this.allDashboards.length - 1])
                }
            }

            await this.$store.dispatch('layout/setupActiveLayout')
            await this.$store.dispatch('templatesCategory/getAllTemplateDictionaries')
            await this.$store.dispatch('layout/setupLayouts')
            await this.$store.dispatch('layout/getGlobalLayout')
            await this.$store.dispatch('widgetTemplate/getAllWidgetTemplates')
            await this.$store.dispatch('dashboards/mapAllDashboardsWidgets')
        } finally {
            await this.$store.dispatch('dashboards/setContentLoading', false)
        }
    },
    computed: {
        layout() {
            return this.$store.getters['layout/getActiveLayout']
        },
        colors() {
            return this.$store.getters['layout/colors']('activeLayout')
        },
        fontSize() {
            return this.$store.getters['layout/baseFontSize']('activeLayout')
        },
        activeDashboard() {
            return this.$store.getters['dashboards/getActiveDashboard']
        },
        allDashboards() {
            return this.$store.getters['dashboards/getAllDashboards']
        },
        isContentLoading() {
            return this.$store.state.dashboards.contentLoading
        }
    },
    methods: {
        initMainColorsVars(colors) {
            for (let color in colors) {
                document.documentElement.style.setProperty('--' + color + '-color', colors[color]);
            }
        },
        initMainFontSizeVar(fontSize) {
            fontSize = fontSize || defaultFontSize
            document.documentElement.style.setProperty('--font-size-xs', (fontSize - 4) + 'px');
            document.documentElement.style.setProperty('--font-size-sm', (fontSize - 2) + 'px');
            document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
            document.documentElement.style.setProperty('--font-size-lg', (fontSize + 2) + 'px');
            document.documentElement.style.setProperty('--font-size-xl', (fontSize + 4) + 'px');
            document.documentElement.style.setProperty('--font-size-2xl', (fontSize + 6) + 'px');
            document.documentElement.style.setProperty('--font-size-3xl', (fontSize + 12) + 'px');
        }
    },
    watch: {
        colors: {
            deep: true,
            immediate: true,
            handler: function (values) {
                if (!values) {
                    return
                }
                this.initMainColorsVars(values)
            },
        },
        fontSize: {
            immediate: true,
            handler: function (value) {
                this.initMainFontSizeVar(value)
            },
        },
        activeDashboard: {
            immediate: true,
            deep: true,
            handler: async function () {
                await this.$store.dispatch('layout/setupActiveLayout')
            },
        },
    },
}
</script>
