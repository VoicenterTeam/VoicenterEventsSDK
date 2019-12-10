<template>
    <nav class="navbar w-full bg-white py-3 flex items-center justify-between z-10">
        <img src="/img/navbar/logo.png" alt="Logo" class="hidden h-10 mb-2 ml-24 md:flex">
        <div>
            <div class="relative">
                <div class="flex items-center py-3 mx-1 sm:mx-6">
                    <div class="flex px-1 cursor-pointer outline-none" @click="showEditSettingsDialog = true">
                        <el-tooltip class="item" effect="dark" :content="$t('tooltip.general.settings')"
                                    placement="bottom">
                            <IconSettings class="text-primary"/>
                        </el-tooltip>
                    </div>
                    <language-select :value="$i18n.locale" @change="onLocaleChange"/>
                    <button class="flex items-center px-1 rounded-lg cursor-pointer outline-none"
                            @click.stop="triggerMenus('showDashboardsMenu', 'showUsersMenu')">
                        <span class="mx-1 text-sm md:text-lg text-gray-700" v-if="activeDashboard">{{activeDashboard.DashboardTitle}}</span>
                        <IconArrowDown/>
                    </button>
                    <button class="flex items-center px-1 rounded-lg cursor-pointer outline-none"
                            @click.stop="triggerMenus('showUsersMenu', 'showDashboardsMenu')">
                        <span
                            class="mx-1 text-sm md:text-lg text-gray-700">{{currentUser.name || $t('navbar.default.username')}}</span>
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
                         class="bg-white shadow-lg rounded-lg py-2 mt-3 absolute w-56 flex flex-col users-menu">
                        <span class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer"
                              @click="chooseUser(user)"
                              v-for="user in allUsers"
                              :class="{ 'text-primary': currentUser.id === user.id}">
                            {{user.name || $t('navbar.default.username') }}
                            <IconMinus v-if="user.id !== currentUser.id"
                                       class="hover:text-red-600 w-4 mr-1 mb-1 fill-current"
                                       :class="$rtl.isRTL ? 'float-left' : 'float-right'"
                                       v-on:click.stop.prevent="removeUser(user)">
                            </IconMinus>
                        </span>
                        <span class="hover:bg-primary-100 hover:text-primary py-3 px-4 cursor-pointer"
                              @click="logout">{{$t('navbar.logout')}}
                        </span>
                    </div>
                </fade-transition>
            </div>
            <el-dialog :visible.sync="showCreateDashboardDialog"
                       :append-to-body="true" :width="dialogWidth">
                <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('dashboards.new.title')}}</h3>
                <el-form @submit.native.prevent="confirmNewDashboard">
                    <el-form-item :label="$t('dashboards.new.form.title')">
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
                :visible.sync="showEditSettingsDialog">
            </settings>
        </div>
    </nav>
</template>
<script>
    import {Dialog, Tooltip} from 'element-ui'
    import Settings from './Settings'
    import LanguageSelect from './LanguageSwitcher'
    import {dashboardModel} from '@/models/instances'

    export default {
        components: {
            [Dialog.name]: Dialog,
            [Tooltip.name]: Tooltip,
            Settings,
            LanguageSelect,
        },
        data() {
            return {
                showDashboardsMenu: false,
                showUsersMenu: false,
                showCreateDashboardDialog: false,
                newDashboard: dashboardModel(),
                showEditSettingsDialog: false,
                dialogWidth: '30%'
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
            allUsers() {
                return this.$store.state.users.allUsers
            },
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
                    ...this.newDashboard
                })
                this.newDashboard = dashboardModel()
                this.showCreateDashboardDialog = false
            },
            onMenuClickOutside() {
                this.showDashboardsMenu = false
                this.showUsersMenu = false
            },
            chooseUser(user) {
                this.$store.dispatch('users/selectCurrentUser', user)
                this.showUsersMenu = false
            },
            removeUser(user) {
                this.$store.dispatch('users/removeUser', user)
            },
            deleteDashboard(dashboard) {
                this.$confirm(
                    this.$t('common.confirm.question', {
                        item: 'dashboard',
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
        }
    }
</script>

<style scoped>
    .navbar {
        height: 90px;
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
