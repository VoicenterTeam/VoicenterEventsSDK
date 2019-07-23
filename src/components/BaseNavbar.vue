<template>
    <nav class="px-24 navbar w-full bg-white shadow py-3 flex justify-between z-10">
        <img src="/img/navbar/logo.png" alt="Logo" class="w-32">
        <div>
            <div class="relative">
                <div class="flex">
                    <button class="flex items-center p-3 rounded-lg cursor-pointer outline-none"
                            @click.stop="triggerMenus('showDashboardsMenu', 'showUsersMenu')">
                        <span class="mr-1 text-lg text-gray-700">{{$t(activeDashboard.Title) || activeDashboard.Title}}</span>
                        <IconArrowDown></IconArrowDown>
                    </button>
                    <button class="flex items-center p-3 rounded-lg cursor-pointer outline-none"
                            @click.stop="triggerMenus('showUsersMenu', 'showDashboardsMenu')">
                        <span class="mr-1 text-lg text-gray-700">{{currentUser.name || $t('navbar.default.username')}}</span>
                        <IconArrowDown></IconArrowDown>
                    </button>
                    <div class="flex p-3 cursor-pointer outline-none" @click="showEditSettingsDialog = true">
                        <IconSettings class="text-primary"></IconSettings>
                    </div>
                </div>
                <fade-transition :duration="250">
                    <div v-if="showDashboardsMenu"
                         v-click-outside="onMenuClickOutside"
                         class="bg-white shadow-lg rounded-lg py-2 mt-3 absolute w-56 flex flex-col">
                    <span class="hover:bg-blue-100 py-3 px-4 cursor-pointer hover:text-blue-600"
                          @click="chooseDashboard(dashboard)"
                          v-for="dashboard in allDashboards"
                          :class="{ 'text-primary': activeDashboard.ID === dashboard.ID}">
                          {{$t(dashboard.Title) || dashboard.Title}}
                    </span>
                        <span class="hover:bg-blue-100 py-3 px-4 cursor-pointer text-gray-600 hover:text-blue-600 flex items-center"
                              @click="createNewDashboard()">
                        <IconPlus class="w-4 mr-1 mb-1 text-primary"></IconPlus>
                        <span>{{$t('common.newDashboard')}}</span>
                    </span>
                    </div>
                </fade-transition>
                <fade-transition :duration="250">
                    <div v-if="showUsersMenu"
                         v-click-outside="onMenuClickOutside"
                         class="bg-white shadow-lg rounded-lg py-2 mt-3 absolute w-56 flex flex-col users-menu">
                        <span class="hover:bg-blue-100 py-3 px-4 cursor-pointer hover:text-blue-600"
                              @click="chooseUser(user)"
                              v-for="user in allUsers"
                              :class="{ 'text-primary': currentUser.id === user.id}">
                            {{user.name || $t('navbar.default.username') }}
                            <IconMinus v-if="user.id !== currentUser.id"
                                       class="hover:text-red-600 w-4 mr-1 mb-1 fill-current float-right"
                                       v-on:click.stop.prevent="removeUser(user)">
                            </IconMinus>
                        </span>
                        <span class="hover:bg-blue-100 py-3 px-4 cursor-pointer hover:text-blue-600"
                              @click="logout">{{$t('navbar.logout')}}
                        </span>
                    </div>
                </fade-transition>
            </div>
            <el-dialog :visible.sync="showCreateDashboardDialog"
                       :append-to-body="true">
                <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('dashboards.new.title')}}</h3>
                <el-form @submit.native.prevent="confirmNewDashboard">
                    <el-form-item :label="$t('dashboards.new.form.title')">
                        <el-input v-model="newDashboard.title"></el-input>
                    </el-form-item>
                </el-form>
                <template slot="footer">
                    <el-button plain @click="showCreateDashboardDialog = false">{{$t('common.cancel')}}</el-button>
                    <el-button type="primary" @click="confirmNewDashboard">{{$t('common.save')}}</el-button>
                </template>
            </el-dialog>
            <settings
                    :visible.sync="showEditSettingsDialog">
            </settings>
        </div>
    </nav>
</template>
<script>
    import {Dialog} from 'element-ui'
    import Settings from './Settings'

    function newDashboardData() {
        return {
            title: ''
        }
    }

    export default {
        components: {
            [Dialog.name]: Dialog,
            Settings
        },
        data() {
            return {
                showDashboardsMenu: false,
                showUsersMenu: false,
                showCreateDashboardDialog: false,
                newDashboard: newDashboardData(),
                showEditSettingsDialog: false,
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
                this.newDashboard = newDashboardData()
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
            logout() {
                localStorage.clear()
                this.$store.dispatch('users/logout')
            },
            triggerMenus(clicked, second) {
                this[clicked] = !this[clicked];
                this[second] = false;
            },
        },
    }
</script>
<style scoped>
    .navbar {
        position: absolute;
        left: 0;
        top: 0;
    }

    .users-menu {
        right: 2.9rem;
    }
</style>
