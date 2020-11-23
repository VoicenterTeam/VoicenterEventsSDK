<template>
    <div class="navbar-wrapper px-4 lg:px-12">
        <nav class="navbar h-16 w-full py-3 flex items-center justify-between z-10">
            <div class="flex items-center h-16 cursor-pointer">
                <img :src="getLogo"
                     @click="onClickLogo"
                     alt="Logo"
                     class="h-10 object-cover">
            </div>
            <div class="flex items-center">
                <LanguageSwitcher class="mx-6"/>
                <AccountMenu class="mx-0"/>
            </div>
        </nav>
    </div>
</template>
<script>
    import AccountMenu from '@/components/Navbar/components/AccountMenu'
    import LanguageSwitcher from '@/components/Navbar/components/LanguageSwitcher'
    
    export default {
        components: {
            AccountMenu,
            LanguageSwitcher,
        },
        computed: {
            getLogo() {
                return this.$store.getters['layout/getLogo']
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
