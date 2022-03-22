<template>
    <div class="navbar-wrapper px-4 lg:px-12">
        <nav class="navbar h-16 w-full py-3 flex items-center justify-between z-10">
            <div class="flex items-center h-16 cursor-pointer hidden md:flex">
                <img :src="getLogo"
                     @click="onClickLogo"
                     alt="Logo"
                     class="h-10">
            </div>
            <div class="flex items-center justify-between w-full">
                <LanguageSwitcher class="md:mx-6"/>
                <AccountMenu class="mx-0"/>
            </div>
        </nav>
    </div>
</template>
<script>
    
    export default {
        components: {
            AccountMenu: () => import('@/components/Navbar/components/AccountMenu'),
            LanguageSwitcher: () => import('@/components/Navbar/components/LanguageSwitcher')
        },
        computed: {
            getLogo() {
                return this.$store.getters['layout/getLogo']('activeLayout')
            },
        },
        methods: {
            onClickLogo() {
                return this.$router.push('/')
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
