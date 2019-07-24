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
            initializeLayout (lang) {
                if (lang === 'he') {
                    this.$rtl.enableRTL()
                } else {
                    this.$rtl.disableRTL()
                }
            },
        },
        mounted () {
            let initialLang = localStorage.getItem('lang')
            this.initializeLayout(initialLang)
        },
        watch: {
            colors() {
                this.initMainStyleVars()
            }
        }
    }
</script>
