<template>
    <div>
        <nav class="navbar w-full bg-white flex items-center justify-between z-10">
            <img :src="getLogo" alt="Logo" class="h-10 my-1 mx-4 flex xl:mx-16">
            <menu-icon
                class="w-8 h-8 p-2 text-primary shadow rounded bg-white hover:bg-primary-100 flex md:hidden mx-4 cursor-pointer"
                @click="triggerMobileMenu"/>
            <div class="hidden md:flex">
                <div class="relative">
                    <div class="flex items-center py-3 mx-4 xl:mx-16">
                        <div class="flex items-center px-2">
                            <slot name="dashboard-operations"/>
                            <div class="flex px-1 cursor-pointer outline-none" @click="showEditSettingsDialog = true">
                                <el-tooltip class="item" effect="dark" :content="$t('tooltip.general.settings')"
                                            placement="bottom">
                                    <button class="btn p-2 shadow rounded bg-white hover:bg-primary-100">
                                        <IconSettings class="text-primary"/>
                                    </button>
                                </el-tooltip>
                            </div>
                            <language-select :value="activeLanguage" @change="onLocaleChange"/>
                        </div>
                        <button class="flex items-center px-1 rounded-lg cursor-pointer outline-none"
                                @click.stop="triggerMenus('showDashboardsMenu', 'showUsersMenu')">
                            <span class="mx-1 text-main-sm md:text-main-lg text-gray-700" v-if="activeDashboard">{{activeDashboard.DashboardTitle}}</span>
                            <IconArrowDown/>
                        </button>
                        <button class="flex items-center px-1 rounded-lg cursor-pointer outline-none"
                                @click.stop="triggerMenus('showUsersMenu', 'showDashboardsMenu')">
                        <span
                            class="mx-1 text-main-sm md:text-main-lg text-gray-700">{{currentUser.name || $t('navbar.default.username')}}</span>
                            <IconArrowDown/>
                        </button>
                    </div>
                    <fade-transition :duration="250">
                        <div v-if="showDashboardsMenu"
                             v-click-outside="onMenuClickOutside"
                             class="bg-white shadow-lg rounded-lg py-2 mt-3 absolute w-56 flex flex-col dashboard-menu">
                    <span class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer"
                          @click="chooseDashboard(dashboard)"
                          v-for="dashboard in allDashboards"
                          :class="{ 'text-primary': activeDashboard.DashboardID === dashboard.DashboardID}">
                          {{dashboard.DashboardTitle}}
                        <el-tooltip class="item" effect="dark" :content="$t('common.deleteDashboard')"
                                    placement="top">
                            <IconMinus v-if="dashboard.DashboardID !== activeDashboard.DashboardID"
                                       class="hover:text-red-600 w-4 mr-1 mb-1 fill-current"
                                       :class="$rtl.isRTL ? 'float-left' : 'float-right'"
                                       v-on:click.stop.prevent="deleteDashboard(dashboard)">
                            </IconMinus>
                        </el-tooltip>
                    </span>
                            <span
                                class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer text-gray-600 flex items-center"
                                @click="createNewDashboard()">
                        <IconPlus class="w-3 mr-1 mb-1 text-primary"/>
                        <span>{{$t('common.newDashboard')}}</span>
                    </span>
                        </div>
                    </fade-transition>
                    <fade-transition :duration="250">
                        <div v-if="showUsersMenu"
                             v-click-outside="onMenuClickOutside"
                             class="bg-white shadow-lg rounded-lg py-2 mt-3 absolute w-56 flex flex-col users-menu max-h-screen overflow-auto">
                        <span class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer"
                              @click="chooseAccount(account)"
                              v-for="account in allAccounts"
                              :class="{ 'text-primary': currentAccountId === account.ID}">
                            {{account.name || $t('navbar.default.username') }}
                        </span>
                            <span class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer"
                                  @click="logout">{{$t('navbar.logout')}}
                        </span>
                        </div>
                    </fade-transition>
                </div>
                <el-dialog :visible.sync="showCreateDashboardDialog"
                           :append-to-body="true" :width="dialogWidth">
                    <h3 slot="title" class="text-main-2xl font-semibold text-gray-700">
                        {{$t('dashboards.new.title')}}</h3>
                    <el-form @submit.native.prevent="confirmNewDashboard">
                        <el-form-item>
                            <label>{{$t('dashboards.new.form.title')}}</label>
                            <el-input v-model="newDashboard.DashboardTitle"/>
                        </el-form-item>
                    </el-form>
                    <template slot="footer">
                        <el-button @click="showCreateDashboardDialog = false">{{$t('common.cancel')}}</el-button>
                        <el-button type="primary" @click="confirmNewDashboard">{{$t('common.save')}}</el-button>
                    </template>
                </el-dialog>
                <settings
                    v-if="showEditSettingsDialog"
                    :activeDashboard="activeDashboard"
                    :width="'55%'"
                    :visible.sync="showEditSettingsDialog">
                </settings>
            </div>
        </nav>
        <fade-transition :duration="400">
            <div class="flex absolute flex-col mt-16 z-10 bg-white w-full py-10"
                 v-if="showMobileMenu">
                <div class="mx-4">
                    <div class="flex items-center justify-center rounded border">
                        <slot name="dashboard-operations"/>
                        <div class="flex px-1 cursor-pointer outline-none" @click="showEditSettingsDialog = true">
                            <el-tooltip class="item" effect="dark" :content="$t('tooltip.general.settings')"
                                        placement="bottom">
                                <button class="btn p-2 shadow rounded bg-white hover:bg-primary-100">
                                    <IconSettings class="text-primary"/>
                                </button>
                            </el-tooltip>
                            <language-select :value="$i18n.locale" @change="onLocaleChange"/>
                        </div>
                    </div>
                    <el-select
                        class="w-full py-2"
                        :value="activeDashboard.DashboardID">
                        <el-option v-for="dashboard in allDashboards"
                                   :value="dashboard.DashboardID"
                                   :label="dashboard.DashboardTitle"
                                   :key="dashboard.DashboardID">
                            <p @click="chooseDashboard(dashboard)">{{dashboard.DashboardTitle}}</p>
                        </el-option>
                    </el-select>
                    <el-select
                        class="w-full py-2"
                        :value="get(allAccounts, '[0].ID')">
                        <el-option v-for="account in allAccounts"
                                   :value="account.ID"
                                   :label="account.name"
                                   :key="account.ID">
                            <p @click="chooseAccount(account)">{{account.name || $t('navbar.default.username') }}</p>
                        </el-option>
                    </el-select>
                    <div class="flex justify-center pt-2" @click="logout">
                        {{$t('navbar.logout')}}
                    </div>
                </div>
            </div>
        </fade-transition>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Dialog, Option, Select, Tooltip} from 'element-ui'
    import {MenuIcon} from 'vue-feather-icons'
    import Settings from './Settings'
    import LanguageSelect from './LanguageSwitcher'
    import {dashboardModel} from '@/models/instances'

    export default {
        components: {
            [Dialog.name]: Dialog,
            [Tooltip.name]: Tooltip,
            [Select.name]: Select,
            [Option.name]: Option,
            Settings,
            LanguageSelect,
            MenuIcon,
        },
        data() {
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
            activeDashboard() {
                return this.$store.state.dashboards.activeDashboard
            },
            allDashboards() {
                return this.$store.state.dashboards.allDashboards
            },
            currentUser() {
                return this.$store.state.users.currentUser
            },
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
            allAccounts() {
                return this.$store.getters['entities/accountsList']
            },
            getLogo() {
                return get(this.activeDashboard, 'DashboardLayout.settings.logo') || '/img/navbar/logo.png'
            },
            activeLanguage() {
                return localStorage.getItem('locale') || this.$i18n.locale
            }
        },
        methods: {
            chooseDashboard(dashboard) {
                this.$store.dispatch('dashboards/selectDashboard', dashboard)
                this.showDashboardsMenu = false
            },
            createNewDashboard() {
                this.showCreateDashboardDialog = true
                this.showDashboardsMenu = false
            },
            confirmNewDashboard() {
                this.$store.dispatch('dashboards/createDashboard', {
                    ...this.newDashboard,
                    AccountID: this.$store.state.entities.selectedAccountID,
                })
                this.newDashboard = dashboardModel()
                this.showCreateDashboardDialog = false
            },
            onMenuClickOutside() {
                this.showDashboardsMenu = false
                this.showUsersMenu = false
            },
            chooseAccount(account) {
                this.$store.commit('entities/SET_SELECTED_ACCOUNT_ID', account.ID)
                this.showUsersMenu = false
            },
            deleteDashboard(dashboard) {
                this.$confirm(
                    this.$t('common.confirm.question', {
                        action: 'to delete this dashboard',
                    }), this.$t('common.deleteDashboard'), {
                        cancelButtonText: this.$t('common.cancel'),
                        confirmButtonText: this.$t('common.confirm'),
                    }).then(() => {
                    this.$store.dispatch('dashboards/deleteDashboard', dashboard)
                })
            },
            logout() {
                localStorage.clear()
                this.$store.dispatch('users/logout')
            },
            triggerMenus(clicked, second) {
                this[clicked] = !this[clicked];
                this[second] = false;
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
            triggerMobileMenu() {
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

    .users-menu {
        right: 3rem;
    }

    .dashboard-menu {
        right: 11rem;
        max-height: 500px;
        overflow: auto;
    }

    .rtl .users-menu {
        left: 3rem;
        right: auto;
    }

    .rtl .dashboard-menu {
        left: 11rem;
        right: auto;
    }

</style>
