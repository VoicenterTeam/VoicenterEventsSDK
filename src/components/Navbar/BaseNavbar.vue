<template>
    <div>
        <div class="navbar__wrapper" v-if="activeDashboard">
            <nav class="navbar w-full bg-white py-3 flex items-center justify-between z-10">
                <img :src="getLogo" alt="Logo" class="h-10 mb-2 mx-4 flex xl:mx-16">
                <menu-icon
                    @click="triggerMobileMenu"
                    class="w-8 h-8 p-2 text-primary shadow rounded bg-white hover:bg-primary-100 flex md:hidden mx-4 cursor-pointer"/>
                <div class="hidden md:flex">
                    <div class="relative">
                        <div class="flex items-center py-3 mx-4 xl:mx-16">
                            <div class="flex items-center px-2">
                                <slot name="dashboard-operations"/>
                                <div @click="showEditSettingsDialog = true"
                                     class="flex px-1 cursor-pointer outline-none">
                                    <el-tooltip :content="$t('tooltip.general.settings')" class="item" effect="dark"
                                                placement="bottom">
                                        <button class="btn p-2 shadow rounded bg-white hover:bg-primary-100">
                                            <IconSettings class="text-primary"/>
                                        </button>
                                    </el-tooltip>
                                </div>
                                <language-select :value="activeLanguage" @change="onLocaleChange"/>
                            </div>
                            <div class="relative">
                                <button @click.stop="triggerMenus('showDashboardsMenu', 'showUsersMenu')"
                                        class="flex items-center px-1 rounded-lg cursor-pointer outline-none">
                                    <span class="mx-1 text-main-sm md:text-main-lg text-gray-700"
                                          v-if="activeDashboard">{{activeDashboard.DashboardTitle}}</span>
                                    <IconArrowDown/>
                                </button>
                                <fade-transition :duration="250">
                                    <div class="bg-white shadow-lg rounded-lg py-2 mt-3 absolute w-56 flex flex-col origin-top-right mt-4 right-0"
                                         v-click-outside="onMenuClickOutside"
                                         v-if="showDashboardsMenu">
                            <span :class="{ 'text-primary': activeDashboard.DashboardID === dashboard.DashboardID}"
                                  @click="chooseDashboard(dashboard)"
                                  class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer"
                                  v-for="dashboard in allDashboards">
                                  {{dashboard.DashboardTitle}}
                                <el-tooltip :content="$t('common.deleteDashboard')" class="item" effect="dark"
                                            placement="top">
                                    <IconMinus :class="$rtl.isRTL ? 'float-left' : 'float-right'"
                                               class="hover:text-red-600 w-4 mr-1 mb-1 fill-current"
                                               v-if="dashboard.DashboardID !== activeDashboard.DashboardID"
                                               v-on:click.stop.prevent="deleteDashboard(dashboard)">
                                    </IconMinus>
                                </el-tooltip>
                            </span>
                                        <span
                                            @click="createNewDashboard()"
                                            class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer text-gray-600 flex items-center">
                                <IconPlus class="w-3 mr-1 mb-1 text-primary"/>
                                <span>{{$t('common.newDashboard')}}</span>
                            </span>
                                    </div>
                                </fade-transition>
                            </div>
                            <div class="relative">
                                <button @click.stop="triggerMenus('showUsersMenu', 'showDashboardsMenu')"
                                        class="flex items-center px-1 rounded-lg cursor-pointer outline-none">
                            <span
                                class="mx-1 text-main-sm md:text-main-lg text-gray-700">{{currentAccount.name || $t('navbar.default.username')}}</span>
                                    <IconArrowDown/>
                                </button>
                                <fade-transition :duration="250">
                                    <div class="bg-white shadow-lg rounded-lg py-2 mt-3 absolute w-56 flex flex-col origin-top-right mt-4 right-0 max-h-screen overflow-auto"
                                         v-click-outside="onMenuClickOutside"
                                         v-if="showUsersMenu">
                                    <span :class="{ 'text-primary': currentAccountId === account.ID}"
                                          @click="chooseAccount(account)"
                                          class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer"
                                          v-for="account in allAccounts">
                                        {{account.name || $t('navbar.default.username') }}
                                    </span>
                                        <span @click="logout"
                                              class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer">{{$t('navbar.logout')}}</span>
                                    </div>
                                </fade-transition>
                            </div>
                        </div>
                    </div>
                    <settings
                        :activeDashboard="activeDashboard"
                        :visible.sync="showEditSettingsDialog"
                        :width="'55%'"
                        v-if="showEditSettingsDialog">
                    </settings>
                </div>
            </nav>
            <fade-transition :duration="400">
                <div class="flex absolute flex-col mt-10 z-10 bg-white w-full py-10"
                     v-if="showMobileMenu">
                    <div class="mx-4">
                        <div class="flex items-center justify-center rounded border">
                            <slot name="dashboard-operations"/>
                            <div @click="showEditSettingsDialog = true" class="flex px-1 cursor-pointer outline-none">
                                <el-tooltip :content="$t('tooltip.general.settings')" class="item" effect="dark"
                                            placement="bottom">
                                    <button class="btn p-2 shadow rounded bg-white hover:bg-primary-100">
                                        <IconSettings class="text-primary"/>
                                    </button>
                                </el-tooltip>
                                <language-select :value="$i18n.locale" @change="onLocaleChange"/>
                            </div>
                        </div>
                        <el-select
                            :value="activeDashboard.DashboardID"
                            class="w-full py-2">
                            <el-option :key="dashboard.DashboardID"
                                       :label="dashboard.DashboardTitle"
                                       :value="dashboard.DashboardID"
                                       v-for="dashboard in allDashboards">
                                <p @click="chooseDashboard(dashboard)">{{dashboard.DashboardTitle}}</p>
                            </el-option>
                        </el-select>
                        <el-select
                            :value="get(allAccounts, '[0].ID')"
                            class="w-full py-2">
                            <el-option :key="account.ID"
                                       :label="account.name"
                                       :value="account.ID"
                                       v-for="account in allAccounts">
                                <p @click="chooseAccount(account)">{{account.name || $t('navbar.default.username')
                                    }}</p>
                            </el-option>
                        </el-select>
                        <div @click="logout" class="flex justify-center pt-2">
                            {{$t('navbar.logout')}}
                        </div>
                    </div>
                </div>
            </fade-transition>
        </div>
        <div class="min-h-screen flex" v-if="accountNoData">
            <div class="w-full flex flex-col items-center justify-center"
                 key="no-data">
                <IconNoData class="h-56 w-56"/>
                <p class="text-gray-600 max-w-lg text-center">{{$t('Account no data')}}</p>
                <span
                    @click="createNewDashboard()"
                    class="hover:bg-primary-100 hover:text-primary py-1 mt-2 px-4 cursor-pointer text-gray-600 flex items-center border-2 rounded">
                        <IconPlus class="w-3 mr-1 mb-0-5 text-primary"/>
                        <span>{{$t('common.newDashboard')}}</span>
                    </span>
            </div>
        </div>
        <modal :append-to-body="true"
               :visible.sync="showCreateDashboardDialog" :width="dialogWidth">
            <h3 class="text-main-2xl font-semibold text-gray-700" slot="title">
                {{$t('Add Dashboard')}}</h3>
            <el-form @submit.native.prevent="confirmNewDashboard">
                <el-form-item>
                    <label>{{$t('dashboards.new.form.title')}}</label>
                    <el-input v-model="newDashboard.DashboardTitle"/>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="showCreateDashboardDialog = false">{{$t('common.cancel')}}</el-button>
                <el-button @click="confirmNewDashboard" type="primary">{{$t('common.save')}}</el-button>
            </template>
        </modal>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Option, Select, Tooltip} from 'element-ui'
    import {MenuIcon} from 'vue-feather-icons'
    import Settings from './Settings'
    import LanguageSelect from './LanguageSwitcher'
    import {dashboardModel} from '@/models/instances'
    import Modal from "@/components/Common/Modal";

    export default {
        components: {
            Modal,
            [Tooltip.name]: Tooltip,
            [Select.name]: Select,
            [Option.name]: Option,
            Settings,
            LanguageSelect,
            MenuIcon,
        },
        data () {
            return {
                get,
                showDashboardsMenu: false,
                showUsersMenu: false,
                showCreateDashboardDialog: false,
                newDashboard: dashboardModel(),
                showEditSettingsDialog: false,
                dialogWidth: '30%',
                showMobileMenu: false,
            }
        },
        computed: {
            activeDashboard () {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            allDashboards () {
                return this.$store.state.dashboards.allDashboards
            },
            currentAccount () {
                return this.$store.getters['entities/getCurrentAccount']
            },
            currentAccountId () {
                return this.$store.state.entities.selectedAccountID
            },
            allAccounts () {
                return this.$store.getters['entities/accountsList']
            },
            getLogo () {
                return get(this.activeDashboard, 'DashboardLayout.settings.logo') || '/img/navbar/logo.png'
            },
            activeLanguage () {
                return localStorage.getItem('locale') || this.$i18n.locale
            },
            loadingData () {
                return this.$store.state.dashboards.loadingData;
            },
            accountNoData () {
                return !this.activeDashboard && !this.loadingData;
            }
        },
        methods: {
            chooseDashboard (dashboard) {
                this.$store.dispatch('dashboards/selectDashboard', dashboard)
                this.showDashboardsMenu = false
            },
            createNewDashboard () {
                this.showCreateDashboardDialog = true
                this.showDashboardsMenu = false
            },
            confirmNewDashboard () {
                this.$store.dispatch('dashboards/createDashboard', {
                    ...this.newDashboard,
                    AccountID: this.$store.state.entities.selectedAccountID,
                })
                this.newDashboard = dashboardModel()
                this.showCreateDashboardDialog = false
            },
            onMenuClickOutside () {
                this.showDashboardsMenu = false
                this.showUsersMenu = false
            },
            chooseAccount (account) {
                this.$store.commit('entities/SET_SELECTED_ACCOUNT_ID', account.ID)
                this.showUsersMenu = false
            },
            deleteDashboard (dashboard) {
                this.$confirm(
                    this.$t('common.confirm.question', {
                        action: this.$t('to delete this dashboard'),
                    }), this.$t('common.deleteDashboard'), {
                        cancelButtonText: this.$t('common.cancel'),
                        confirmButtonText: this.$t('common.confirm'),
                    }).then(() => {
                    this.$store.dispatch('dashboards/deleteDashboard', dashboard)
                })
            },
            logout () {
                localStorage.clear()
                this.$store.dispatch('users/logout')
            },
            triggerMenus (clicked, second) {
                this[clicked] = !this[clicked];
                this[second] = false;
            },
            onLocaleChange (val) {
                this.$store.dispatch('lang/setLanguage', val)
                this.$i18n.locale = val
                if (val === 'he') {
                    this.$rtl.enableRTL()
                } else {
                    this.$rtl.disableRTL()
                }
            },
            triggerMobileMenu () {
                this.showMobileMenu = !this.showMobileMenu
            }
        }
    }
</script>

<style scoped>
    .navbar {
        height: 50px;
        min-width: 320px;
        position: absolute;
        left: 0;
        top: 0;
        border-bottom: 1px solid var(--silver-color);
    }
</style>
