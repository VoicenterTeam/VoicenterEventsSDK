<template>
    <nav class="px-24 navbar w-full bg-white shadow py-3 flex justify-between z-10">
        <img src="/img/navbar/logo.png" alt="Logo" class="w-32">
        <div>
            <div class="relative">
                <div class="flex">
                    <button class="flex items-center p-3 rounded-lg cursor-pointer outline-none"
                            @click.stop="showDashboardsMenu = !showDashboardsMenu, showUsersMenu = false">
                        <span class="mr-1 text-lg text-gray-700">{{$t(activeDashboard.Title) || activeDashboard.Title}}</span>
                        <IconArrowDown></IconArrowDown>
                    </button>
                    <button class="flex items-center p-3 rounded-lg cursor-pointer outline-none"
                            @click.stop="showUsersMenu = !showUsersMenu, showDashboardsMenu = false">
                        <span class="mr-1 text-lg text-gray-700">{{currentUser.name}}</span>
                        <IconArrowDown></IconArrowDown>
                    </button>
                </div>
                <fade-transition :duration="250">
                    <div v-if="showDashboardsMenu"
                         v-click-outside="onMenuClickOutside"
                         class="bg-white shadow-lg rounded-lg py-2 mt-3 absolute w-56 flex flex-col">
                    <span class="hover:bg-blue-100 py-3 px-4 cursor-pointer hover:text-blue-600"
                          @click="chooseDashboard(dashboard)"
                          v-for="dashboard in allDashboards">
                          {{$t(dashboard.Title) || dashboard.Title}}
                    </span>
                        <span class="hover:bg-blue-100 py-3 px-4 cursor-pointer text-gray-600 hover:text-blue-600 flex items-center"
                              @click="createNewDashboard()">
                        <IconPlus class="w-4 mr-1 mb-1 fill-current"></IconPlus>
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
                          v-for="user in allUsers">
                          {{user.name}}
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
        </div>
    </nav>
</template>
<script>
    import {Dialog} from 'element-ui'

    function newDashboardData() {
        return {
            title: ''
        }
    }

    export default {
        components: {
            [Dialog.name]: Dialog
        },
        data() {
            return {
                showDashboardsMenu: false,
                showUsersMenu: false,
                showCreateDashboardDialog: false,
                newDashboard: newDashboardData()
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
        }
    }
</script>
<style scoped>
    .navbar {
        position: absolute;
        left: 0;
        top: 0;
    }

    .users-menu {
        right: 0;
    }
</style>
