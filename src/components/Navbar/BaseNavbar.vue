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
                <DashboardMenu :editMode="editMode" v-if="layoutType === 'activeLayout'" />
                <!-- TODO: commented before reports branch will be merged in production -->
                <!-- <ManageReports/> -->
            </div>
            <div class="flex items-center p-2 sm:justify-between sm:w-full lg:w-auto">
                <slot name="dashboard-operations"/>
                <div class="flex justify-between w-full items-center" v-if="layoutType === 'activeLayout'">
                    <LanguageSwitcher class="lg:mx-5" />
                    <AccountMenu />
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
    export default {
        components: {
            AccountMenu: () => import('@/components/Navbar/components/AccountMenu'),
            ManageReports: () => import('@/components/Navbar/components/ManageReports'),
            DashboardMenu: () => import('@/components/Navbar/components/DashboardMenu'),
            LanguageSwitcher: () => import('@/components/Navbar/components/LanguageSwitcher')
        },
        props: {
            editMode: {
                type: Boolean
            },
            layoutType: {
                type: String
            }
        },
        computed: {
            getTypeOfLayout () {
                return this.$store.getters['layout/getTypeOfLayout']
            },
            getLogo() {
                return this.$store.getters['layout/getLogo'](this.getTypeOfLayout)
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
