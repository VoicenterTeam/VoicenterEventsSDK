<template>
    <fade-transition mode="out-in" :duration="100">
        <Dashboard :account-no-data="accountNoData"/>
    </fade-transition>
</template>
<script>
    import Dashboard from '@/views/Dashboard'
    
    export default {
        components: {
            Dashboard,
        },
        computed: {
            accountNoData() {
                return !this.loadingData && !this.activeDashboard
            },
            activeDashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            loadingData() {
                return this.$store.state.dashboards.loadingData
            },
        },
    }
</script>
