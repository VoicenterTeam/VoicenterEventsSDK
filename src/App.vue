<template>
    <div id="app">
        <base-navbar></base-navbar>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        created() {
            this.$store.dispatch('dashboards/getDashboards')
            this.$store.dispatch('widgets/getAllWidgets')
            this.$store.dispatch('charts/getAllCharts')
            this.$store.dispatch('settings/setSettings')
            this.$store.dispatch('lang/setLanguage', process.env.VUE_APP_I18N_LOCALE)
        },
        computed: {
            colors() {
                return this.$store.state.settings.colors
            }
        },
        methods: {
            initMainStyleVars() {
                for (let color in this.colors) {
                    document.documentElement.style.setProperty('--' + color + '-color', this.colors[color]);
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
                handler: function () {
                    this.initMainStyleVars()
                }
            }
        }
    }
</script>
