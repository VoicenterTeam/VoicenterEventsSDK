<template>
    <fade-transition mode="out-in" :duration="100">
        <Dashboard :account-no-data="accountNoData"/>
    </fade-transition>
</template>
<script>
    
    export default {
        components: {
            Dashboard: () => import('@/views/Dashboard'),
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
