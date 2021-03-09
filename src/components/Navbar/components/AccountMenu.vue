<template>
    <div class="flex relative items-center"
         v-bind="$attrs">
        <div class="flex h-10 relative">
            <div class="flex relative">
                <IconAvatar/>
                <div class="circle-indicator absolute right-0"/>
            </div>
            <button @click.stop="triggerMenu"
                    class="flex items-center px-1 rounded-lg cursor-pointer focus:outline-none">
                <span class="mx-1 text-main-sm md:text-main-lg text-gray-500 w-40 truncate">
                    {{ currentAccount.name || $t('navbar.default.username') }}
                </span>
                <IconArrowDown class="text-gray-500 transition mx-1" :class="{'is-expanded': showMenu}"/>
            </button>
            <fade-transition :duration="350">
                <div v-click-outside="onMenuClickOutside"
                     class="menu-wrapper"
                     v-if="showMenu">
                    <span :class="{ 'text-primary': currentAccountId === account.ID}"
                          @click="chooseAccount(account)"
                          class="hover:text-primary py-3 px-4 cursor-pointer border-b"
                          v-for="account in allAccounts">
                        {{ account.name || $t('navbar.default.username') }}
                    </span>
                    <span @click="logout"
                          class="hover:text-primary py-3 px-4 cursor-pointer">
                          {{ $t('navbar.logout') }}
                    </span>
                </div>
            </fade-transition>
        </div>
    </div>
</template>
<script>

export default {
    inheritAttrs: false,
    data() {
        return {
            showMenu: false,
        }
    },
    computed: {
        currentAccount() {
            return this.$store.getters['entities/getCurrentAccount']
        },
        currentAccountId() {
            return this.$store.state.entities.selectedAccountID
        },
        allAccounts() {
            return this.$store.getters['entities/accountsList']
        },
    },
    methods: {
        onMenuClickOutside() {
            this.showDashboardsMenu = false
            this.showMenu = false
        },
        chooseAccount(account) {
            this.$store.commit('entities/SET_SELECTED_ACCOUNT_ID', account.ID)
            this.showMenu = false
            this.getUserDashboards()
        },
        resetOldActiveDashboard() {
          localStorage.removeItem('active-dashboard')
        },
        async getUserDashboards() {
            this.resetOldActiveDashboard()
            await this.$store.dispatch('dashboards/getDashboards')
            await this.$store.dispatch('dashboards/selectDashboard')
        },
        logout() {
            localStorage.clear()
            this.$store.dispatch('users/logout')
        },
        triggerMenu() {
            this.showMenu = !this.showMenu
        },
        onLocaleChange(val) {
            this.$store.dispatch('lang/setLanguage', val)
            this.$i18n.locale = val
            if (val === 'he') {
                this.$rtl.enableRTL()
            } else {
                this.$rtl.disableRTL()
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.menu-wrapper {
    @apply z-50 rounded bg-white mt-12 absolute w-56 px-3 flex flex-col origin-top-right right-0 max-h-64 overflow-auto;
    box-shadow: 0 0 5px var(--gray-350);
}

.transition {
    transition: all 0.2s ease-in;
}

.is-expanded {
    transform: rotate(-180deg);
}

.circle-indicator {
    @apply w-2 h-2 rounded-full bg-green-main;
    content: '';
}

</style>
