<template>
    <div class="flex relative w-64 dashboard-title_wrapper">
        <button @click.stop="triggerMenu"
                class="flex w-full items-center rounded cursor-pointer focus:outline-none justify-between px-4">
            <div class="text-main-sm md:text-main-lg text-gray-500 w-56 truncate flex items-center">
                <IconColorPicker class="w-4-5 h-4-5 text-primary"/>
                <span class="mx-2">{{ activeDashboard.DashboardTitle }}</span>
            </div>
            <div class="flex">
                <IconArrowDown class="text-gray-500 transition"
                               :class="{'is-expanded': showMenu}"/>
            </div>
        </button>
        <fade-transition :duration="350">
            <div v-click-outside="onMenuClickOutside"
                 class="menu-wrapper"
                 v-if="showMenu">
                <div class="py-3 px-4 text-gray-500 hover:text-primary cursor-pointer flex items-center"
                     @click="newDashboard">
                    <IconAddDashboard class="focus:outline-none"/>
                    <span class="mx-2 mt-1">{{ $t('common.newDashboard') }}</span>
                </div>
                <div class="dashboards">
                    <div @click="chooseDashboard(dashboard)"
                         class="flex flex-row items-center justify-between py-3 px-1 mx-4 cursor-pointer border-t"
                         v-for="dashboard in allDashboards">
                        <div class="flex-1 hover:text-primary"
                             :class="{'text-primary': +dashboard.DashboardID === +activeDashboard.DashboardID}">
                            {{ dashboard.DashboardTitle }}
                        </div>
                        <template v-if="dashboard.DashboardID !== activeDashboard.DashboardID">
                            <el-tooltip :content="$t('common.deleteDashboard')" class="item"
                                        effect="dark"
                                        placement="top">
                                <button @click.stop.prevent="tryDeleteDashboard(dashboard)"
                                        class="btn p-1 shadow rounded bg-white hover:bg-primary-100 mx-1">
                                    <IconDelete class="text-red w-4 h-4"/>
                                </button>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            <el-tooltip :content="$t('Manage Layout')"
                                        lass="item"
                                        effect="dark"
                                        placement="top">
                                <button @click.stop.prevent="manageLayout()"
                                        class="btn p-1 shadow rounded bg-white hover:bg-primary-100 mx-1">
                                    <SettingsIcon class="w-4 h-4 text-green-700"/>
                                </button>
                            </el-tooltip>
                        </template>
                    </div>
                </div>
            </div>
        </fade-transition>
        <ConfirmDialog :visible.sync="showConfirmDialog"
                       @on-cancel="showConfirmDialog = false"
                       @on-confirm="deleteDashboard"
        />
    </div>
</template>
<script>
    import { Tooltip } from 'element-ui'
    import { SettingsIcon } from 'vue-feather-icons'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    
    export default {
        components: {
            SettingsIcon,
            ConfirmDialog,
            [Tooltip.name]: Tooltip,
        },
        data() {
            return {
                showMenu: false,
                modalWidth: '30%',
                currentAccountId: null,
                showConfirmDialog: false,
                dashboardToDelete: null,
            }
        },
        computed: {
            activeDashboard() {
                return this.$store.getters['dashboards/getActiveDashboard'] || { DashboardTitle: '--' }
            },
            allDashboards() {
                return this.$store.state.dashboards.allDashboards
            },
            dashboards() {
                return this.allDashboards.filter(dashboard => dashboard.DashboardID.toString() !== this.activeDashboard.DashboardID.toString())
            },
        },
        methods: {
            newDashboard() {
                this.$router.push('/dashboard-creation')
            },
            manageLayout() {
                this.$router.push('/dashboard-settings')
            },
            triggerMenu() {
                this.showMenu = !this.showMenu
            },
            onMenuClickOutside() {
                this.showMenu = false
            },
            chooseDashboard(dashboard) {
                this.$store.dispatch('dashboards/selectDashboard', dashboard)
                this.showMenu = false
            },
            tryDeleteDashboard(dashboard) {
                this.dashboardToDelete = dashboard
                this.showConfirmDialog = true
            },
            async deleteDashboard() {
                await this.$store.dispatch('dashboards/deleteDashboard', this.dashboardToDelete)
                this.showConfirmDialog = false
                this.dashboardToDelete = null
            },
        },
    }
</script>
<style lang="scss" scoped>
.dashboard-title_wrapper {
    @apply rounded h-10 shadow-base;
}

.menu-wrapper {
    @apply z-50 rounded bg-white mt-12 absolute w-64  flex flex-col origin-top-right right-0 shadow-base;
    
    .dashboards {
        @apply max-h-64 overflow-auto;
    }
}

.transition {
    transition: all 0.2s ease-in;
}

.is-expanded {
    transform: rotate(-180deg);
}
</style>
