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
            await this.$store.dispatch('templatesCategory/getAllTemplatesCategory')
            await this.$store.dispatch('dashboards/getDashboards')
            await this.$store.dispatch('entities/getEntitiesList')
            this.$store.dispatch('dashboards/selectDashboard')
            this.$store.dispatch('widgetTemplate/getAllWidgetTemplates')
        },
        computed: {
            colors() {
                return this.$store.state.dashboards.settings.colors
            },
            fontSize() {
                return this.$store.state.dashboards.settings.fontSize
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
            this.initMainColorsVars(settings.colors)
            this.initializeLayout(this.$store.state.lang.language)
        },
        watch: {
            colors: {
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
            }
        }
    }
</script>
