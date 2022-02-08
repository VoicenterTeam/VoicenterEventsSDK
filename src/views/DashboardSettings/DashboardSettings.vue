<template>
    <div class="flex w-full flex-col dashboard-settings">
        <div class="w-full flex flex-col relative">
            <NavBar/>
            <div class="w-full px-4 2xl:px-40 3xl:px-64 border-b border-gray-300">
                <slot>
                    <div class="items-center flex justify-between md:h-23-5">
                        <div class="flex items-center xl:-mx-24 w-full">
                            <div @click="onDiscard"
                                 class="col-span-1 flex items-center text-primary-300 hover:text-primary cursor-pointer">
                                <IconDirLeft/>
                                <span class="mx-1">{{ $t('general.back') }}</span>
                            </div>
                            <span class="mx-4 lg:mx-8">
                            <svg width="1" height="88" viewBox="0 0 1 88" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="1" height="88" fill="#EBEBEB"/>
                            </svg>
                            </span>
                            <div class="flex flex-col w-full flex-1">
                                <span class="text-xl font-bold text-gray-900">
                                    {{ $t('dashboard.dashboardSettings') }}
                                </span>
                                <div class="flex justify-center items-center w-full md:hidden flex-col">
                                    <base-button type="danger"
                                                 outline
                                                 square
                                                 size="sm"
                                                 @click="onDelete">
                                        <template v-slot:icon>
                                            <IconDelete />
                                        </template>
                                    </base-button>
                                    <CopyDashboard class="mx-4"
                                                   :dashboard="activeDashboard"/>
                                    <confirm-button
                                        :loading="loading"
                                        :label="this.$t('Save')"
                                        icon="IconSave"
                                        @on-click="onSubmit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="flex-row items-center hidden md:flex">
                            <base-button type="danger"
                                         outline
                                         square
                                         size="md"
                                         @click="onDelete">
                                <template v-slot:icon>
                                    <IconDelete />
                                </template>
                            </base-button>
                            <CopyDashboard class="mx-4"
                                           :dashboard="activeDashboard"/>
                            <confirm-button
                                :loading="loading"
                                :label="this.$t('Save')"
                                icon="IconSave"
                                @on-click="onSubmit"
                            />
                        </div>
                    </div>
                </slot>
            </div>
            <div class="w-full px-4 mt-6 lg:px-16 2xl:px-40 3xl:px-64">
                <DashboardSettings v-model="model"
                                   @on-update-groups="onUpdateGroups"
                                   @on-change-layout="onChangeLayout"
                                   :current-dashboard="currentDashboard"/>
            </div>
        </div>
        <ConfirmDialog :visible.sync="showConfirmDialog"
                       @on-cancel="showConfirmDialog = false"
                       @on-confirm="deleteDashboard"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { Popover } from 'element-ui'
    import cloneDeep from 'lodash/cloneDeep'
    import NavBar from '@/views/common/NavBar'
    import { LayoutApi } from '@/api/layoutApi'
    import { DashboardApi } from '@/api/dashboardApi'
    import { WidgetGroupsApi } from '@/api/widgetGroupApi'
    import DeleteLayout from '@/views/common/DeleteLayout'
    import CopyDashboard from '@/views/DashboardSettings/sections/CopyDashboard'
    import DashboardSettings from '@/views/DashboardSettings/sections/DashboardSettings'
    import ColorParameterType from '@/views/DashboardSettings/LayoutManagement/components/ColorParameterType'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import map from "lodash/map";
    import {removeDummyWidgets} from "@/services/widgetService";
    import {dashboardOperation} from "@/models/instances";
    import {targets, types} from "@/enum/operations";
    import ConfirmButton from "@/components/Common/Buttons/ConfirmButton"

    export default {
        components: {
            NavBar,
            DeleteLayout,
            CopyDashboard,
            ColorParameterType,
            DashboardSettings,
            [Popover.name]: Popover,
            ConfirmDialog,
            ConfirmButton
        },
        data() {
            return {
                model: {},
                currentDashboard: {},
                loading: false,
                initialLayout: {},
                showConfirmDialog: false
            }
        },
        computed: {
            activeDashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            activeLayout() {
                return this.$store.getters['layout/getActiveLayout']
            },
            getActiveDashboardLayoutID() {
                return get(this.$store.getters['dashboards/getActiveDashboard'], 'DashboardLayoutID', 1)
            },
            storedDashboardLayout() {
                return this.$store.getters['layout/storedDashboardLayout'](this.getActiveDashboardLayoutID)
            },
            allDashboards() {
                return this.$store.getters['dashboards/getAllDashboards']
            }
        },
        methods: {
            async onDiscard(goBack = true) {
                if (goBack) {
                    await this.$store.dispatch('dashboards/getDashboards')
                    await this.$router.push('/')
                    return
                }
                this.discardLayoutChanges()
                this.discardGroupsManagement()
            },
            discardLayoutChanges() {
                this.$store.dispatch('layout/updateActiveLayout', this.initialLayout)
            },
            discardGroupsManagement() {
                this.model = cloneDeep(this.$store.state.dashboards.activeDashboard)
                this.currentDashboard = cloneDeep(this.$store.state.dashboards.activeDashboard)
            },
            async deleteDashboard() {
                try {
                    this.loading = true
                    await this.$store.dispatch('dashboards/deleteDashboard', this.currentDashboard)
                    if (!this.allDashboards.length) {
                        await this.$router.push('/')
                        return
                    }
                    await this.$store.dispatch('dashboards/selectDashboard', this.allDashboards[this.allDashboards.length - 1])
                    await this.$router.push('/')
                } catch (err) {
                    console.error(err)
                } finally {
                    this.loading = false
                    this.showConfirmDialog = false
                }
            },
            async onDelete() {
                this.showConfirmDialog = true
            },
            async onSubmit(goBack = true) {
                try {
                    this.loading = true
                    this.model['DashboardLayoutID'] = this.activeLayout.LayoutID
                    const toUpdatePromises = this.currentDashboard.WidgetGroupList.map((group, index) => {
                        return WidgetGroupsApi.update({
                            ...group,
                            Order: index,
                        })
                    })

                    await DashboardApi.update(this.model)
                    await LayoutApi.update(this.activeLayout)
                    await Promise.all(toUpdatePromises)

                    const { DashboardID } = this.model
                    const dashboard = await DashboardApi.find(DashboardID)
                    await this.updateState(dashboard)
                    if (goBack) {
                        await this.$store.dispatch('dashboards/getDashboards')
                        await this.$router.push('/')
                    }
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false

                }
            },
            async onChangeLayout(layout) {
                this.model['DashboardLayoutID'] = layout.LayoutID
                await this.$store.dispatch('dashboards/updateDashboard', this.model)
            },
            keepInitialLayout() {
                this.initialLayout = cloneDeep(this.activeLayout)
            },
            async updateState(dashboard) {
                this.$store.commit('layout/SET_ACTIVE_LAYOUT', this.activeLayout)
                await this.$store.dispatch('dashboards/updateCurrentDashboard', dashboard)
            },
            onUpdateGroups(groups) {
                this.currentDashboard.WidgetGroupList = groups
                this.model.WidgetGroupList = groups
            },
        },
        mounted() {
            this.keepInitialLayout()
        },
        watch: {
            activeDashboard: {
                immediate: true,
                deep: true,
                handler(dashboard) {
                    this.model = cloneDeep(dashboard)
                    this.currentDashboard = cloneDeep(dashboard)
                },
            },
        },
    }
</script>
