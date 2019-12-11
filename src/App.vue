<template>
    <div id="app">
        <base-navbar/>
        <router-view/>
    </div>
</template>
<script>
    export default {
        async created() {
            await this.$store.dispatch('templatesCategory/getAllTemplatesCategory')
            await this.$store.dispatch('dashboards/getDashboards')
            await this.$store.dispatch('entities/getEntitiesList')
            this.$store.dispatch('dashboards/selectDashboard')
            this.$store.dispatch('widgetTemplate/getAllWidgetTemplates')
            this.$store.dispatch('lang/setLanguage', process.env.VUE_APP_I18N_LOCALE)
        },
        computed: {
            colors() {
                return this.$store.state.dashboards.settings.colors
            }
        },
        methods: {
            initMainStyleVars(colors) {
                for (let color in colors) {
                    document.documentElement.style.setProperty('--' + color + '-color', colors[color]);
                }
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
                immediate: true,
                handler: function (values) {
                    this.initMainStyleVars(values)
                }
            }
        }
    }
</script>
