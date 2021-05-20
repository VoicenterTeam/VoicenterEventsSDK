<template>
    <div class="navbar-wrapper px-4 lg:px-12">
        <nav
            class="navbar h-auto lg:h-16 w-full xl:py-3 items-center justify-between z-10 hidden sm:flex sm:flex-col lg:flex-row">
            <div class="flex items-center h-16 sm:justify-between sm:w-full lg:w-auto border-b">
                <i @click="$router.push('/')"
                   class="cursor-pointer">
                    <img :src="getLogo"
                         alt="Logo"
                         class="h-10">
                </i>
                <IconHorisontalLine class="hidden lg:flex mx-4 xl:mx-12"/>
                <DashboardMenu/>
                <ManageReports/>
            </div>
            <div class="flex items-center p-2 sm:justify-between sm:w-full lg:w-auto">
                <slot name="dashboard-operations"/>
                <div class="flex justify-between w-full items-center">
                    <LanguageSwitcher class="lg:mx-5"/>
                    <AccountMenu/>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
    import AccountMenu from '@/components/Navbar/components/AccountMenu'
    import ManageReports from '@/components/Navbar/components/ManageReports'
    import DashboardMenu from '@/components/Navbar/components/DashboardMenu'
    import LanguageSwitcher from '@/components/Navbar/components/LanguageSwitcher'
    
    export default {
        components: {
            AccountMenu,
            ManageReports,
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
