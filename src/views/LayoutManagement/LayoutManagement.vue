<template>
    <div class="flex flex-col bg-white min-h-screen">
        <div class="border-b px-16 flex flex-row justify-between h-14 items-center">
            <img :src="getLogo()" alt="Logo" class="h-10">
            <div class="flex items-center">
                <language-select class="mx-2" :value="activeLanguage" @change="onLocaleChange"/>
                <el-button
                    size="mini"
                    class="back-button"
                    @click="redirectBack">
                    <el-tooltip class="item" effect="dark" :content="$t('Back to Dashboard')"
                                placement="top">
                        <div class="flex items-center h-8">
                            <ArrowLeftIcon class="w-4"/>
                            <span class="px-1 text-main-sm">{{$t('Back to Dashboard')}}</span>
                        </div>
                    </el-tooltip>
                </el-button>
                <span class="mx-3 account-details">{{activeDashboard.DashboardTitle}}</span>
                <span class="account-details">{{currentAccount.name}}</span>
            </div>
        </div>
        <div class="content-wrapper" v-if="!$rtl.isRTL">
            <div class="layouts-container">
                <account-layout
                    v-if="showLayouts"
                    :dashboardLayoutID="dashboardLayoutID"
                    :currentAccountId="currentAccountId"
                    @refresh-current-layout="refreshCurrentLayout"
                    :activeDashboard="activeDashboard"/>
            </div>
            <div class="layouts-container">
                <current-layout
                    ref="currentLayout"
                    @refresh-layouts="refreshLayouts"
                    v-if="showCurrentLayout"
                    :dashboardLayoutID="dashboardLayoutID"></current-layout>
            </div>
        </div>
        <div class="content-wrapper" v-else>
            <div class="layouts-container">
                <current-layout
                    @refresh-layouts="refreshLayouts"
                    v-if="showCurrentLayout"
                    :dashboardLayoutID="dashboardLayoutID"></current-layout>
            </div>
            <div class="layouts-container">
                <account-layout
                    v-if="showLayouts"
                    :dashboardLayoutID="dashboardLayoutID"
                    :currentAccountId="currentAccountId"
                    @refresh-current-layout="refreshCurrentLayout"
                    :activeDashboard="activeDashboard"/>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import CurrentLayout from "./parts/CurrentLayout";
    import AccountLayout from "./parts/AccountLayout";
    import {Tooltip} from 'element-ui'
    import {ArrowLeftIcon} from 'vue-feather-icons'
    import LanguageSelect from '@/components/Navbar/LanguageSwitcher'
    import {DEFAULT_LOGO} from './layout-management'

    export default {
        components: {
            LanguageSelect,
            CurrentLayout,
            AccountLayout,
            ArrowLeftIcon,
            [Tooltip.name]: Tooltip,
        },
        data() {
            return {
                activeTab: 'enabledLayouts',
                accountLayouts: [],
                activeCollapses: [],
                showCurrentLayout: true,
                showLayouts: true,
            }
        },
        computed: {
            activeDashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            dashboardLayoutID() {
                return get(this.activeDashboard, 'DashboardLayoutID', 1);
            },
            currentAccount() {
                return this.$store.getters['entities/getCurrentAccount']
            },

            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
            activeLanguage() {
                return localStorage.getItem('locale') || this.$i18n.locale
            },
        },
        methods: {
            getLogo() {
                if (this.$refs.currentLayout) {
                    return this.$refs.currentLayout.dashboardLogo()
                }
                return DEFAULT_LOGO
            },
            redirectBack() {
                this.$router.go(-1)
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
            refreshCurrentLayout() {
                this.showCurrentLayout = false
                this.$nextTick(() => {
                    this.showCurrentLayout = true
                })
            },
            refreshLayouts() {
                this.showLayouts = false
                this.$nextTick(() => {
                    this.showLayouts = true
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .account-details {
        @apply text-main-sm text-gray-700 shadow-md py-2 px-3 rounded;
    }

    .back-button {
        @apply shadow-md border border-primary bg-transparent;
        padding: 2px 10px;
    }

    .content-wrapper {
        @apply px-4 py-8 flex flex-row w-full;

        .layouts-container {
            @apply w-1/2 mx-4 px-5 py-4 rounded;
            height: 88vh;
            overflow: auto;
            box-shadow: 0 1px 3px 0 rgba(47, 51, 50, 0.08), 0 1px 0 0 rgba(47, 51, 50, 0.08), 0 0 0 1px rgba(47, 51, 50, 0.06), 0 5px 15px 0 rgba(47, 51, 50, 0.04);

            /deep/ div.el-collapse .el-collapse-item__content {
                padding: 0 1rem 1rem;
            }
        }
    }
</style>
