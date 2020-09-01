<template>
    <div id="app">
        <network-status-alert/>
        <router-view/>
    </div>
</template>
<script>
    import {defaultFontSize, settings} from '@/enum/defaultDashboardSettings'
    import NetworkStatusAlert from '@/components/Common/NetworkStatusAlert'

    export default {
        components: {
            NetworkStatusAlert
        },
        async created() {
            await this.$store.dispatch('dashboards/getDashboards')
            await this.$store.dispatch('entities/getEntitiesList')
            await this.$store.dispatch('templatesCategory/getAllTemplatesCategory')
            await this.$store.dispatch('dashboards/selectDashboard')
            await this.$store.dispatch('layout/setLayout')
            this.$store.dispatch('widgetTemplate/getAllWidgetTemplates')
        },
        computed: {
            layout() {
                return this.$store.state.layout.data
            },
            colors() {
                return this.$store.getters['layout/colors']
            },
            fontSize() {
                return this.$store.getters['layout/baseFontSize']
            },
            activeDashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
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
            },
            initializeLayout(lang) {
                if (lang === 'he') {
                    this.$rtl.enableRTL()
                } else {
                    this.$rtl.disableRTL()
                }
            },
        },
        mounted() {
            this.initializeLayout(this.$store.state.lang.language)
        },
        watch: {
            colors: {
                deep: true,
                immediate: true,
                handler: function (values) {
                    this.initMainColorsVars(values)
                }
            },
            fontSize: {
                immediate: true,
                handler: function (value) {
                    this.initMainFontSizeVar(value)
                }
            },
            activeDashboard: {
                deep: true,
                handler: async function () {
                    await this.$store.dispatch('layout/setLayout')
                }
            }
        }
    }
</script>
