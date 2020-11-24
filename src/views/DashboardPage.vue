<template>
    <fade-transition mode="out-in" :duration="100">
        <AccountNoData v-if="accountNoData"/>
        <Dashboard v-else/>
    </fade-transition>
</template>
<script>
    import Dashboard from '@/views/Dashboard'
    import AccountNoData from '@/views/AccountNoData'
    
    export default {
        components: {
            Dashboard,
            AccountNoData,
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
