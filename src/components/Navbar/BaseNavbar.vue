<template>
    <div class="navbar-wrapper px-4 lg:px-12">
        <nav class="navbar h-16 w-full py-3 flex items-center justify-between z-10">
            <div class="flex items-center h-16">
                <img :src="getLogo"
                     alt="Logo"
                     class="h-10 object-cover">
                <IconHorisontalLine class="mx-4 lg:mx-12"/>
                <DashboardMenu/>
            </div>
            <div class="flex items-center px-2">
                <slot name="dashboard-operations"/>
                <LanguageSwitcher class="mx-5"/>
                <AccountMenu/>
            </div>
        </nav>
    </div>
</template>
<script>
    import AccountMenu from '@/components/Navbar/components/AccountMenu'
    import DashboardMenu from '@/components/Navbar/components/DashboardMenu'
    import LanguageSwitcher from '@/components/Navbar/components/LanguageSwitcher'
    
    export default {
        components: {
            AccountMenu,
            DashboardMenu,
            LanguageSwitcher,
        },
        computed: {
            getLogo() {
                return this.$store.getters['layout/getLogo']
            },
        },
    }
</script>
<style scoped>
.navbar-wrapper {
    @apply flex w-full bg-white;
    border-bottom: 1px solid var(--gray-350);
}
</style>
