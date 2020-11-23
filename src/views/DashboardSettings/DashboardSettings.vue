<template>
    <div class="flex w-full flex-col dashboard-settings">
        <div class="w-full flex flex-col relative">
            <NavBar/>
            <div class="w-full px-4 lg:px-32 xl:px-64 border-b border-gray-300">
                <slot>
                    <div class="items-center flex justify-between h-23-5">
                        <div class="flex items-center -mx-24">
                            <div @click="onDiscard(true)"
                                 class="col-span-1 flex items-center text-primary-300 hover:text-primary cursor-pointer">
                                <IconDirLeft/>
                                <span class="mx-1">{{ $t('Back') }}</span>
                            </div>
                            <span class="mx-8">
                            <svg width="1" height="88" viewBox="0 0 1 88" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="1" height="88" fill="#EBEBEB"/>
                            </svg>
                        </span>
                            <span class="text-xl font-bold text-gray-900">
                            {{ $t('Dashboard Settings') }}
                        </span>
                        </div>
                        <div class="flex flex-row items-center">
                            <base-button class="mx-4"
                                         @click="onDiscard()"
                                         variant="discard"
                                         fixed-width="w-37">
                                <div class="flex items-center">
                                    <IconDiscard class="mx-1"/>
                                    <span class="mx-1 text-base font-bold">{{ $t('Discard') }}</span>
                                </div>
                            </base-button>
                            <base-button fixed-width="w-37"
                                         :loading="loading"
                                         @click="onSubmit()">
                                <div class="flex items-center">
                                    <IconSave class="mx-1"/>
                                    <span class="mx-1 text-base font-bold">{{ $t('Save') }}</span>
                                </div>
                            </base-button>
                        </div>
                    </div>
                </slot>
            </div>
            <div class="w-full px-4 mt-6 lg:px-32 xl:px-64">
                <DashboardSettings v-model="model"
                                   :active-dashboard="activeDashboard"/>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { Popover } from 'element-ui'
    import cloneDeep from 'lodash/cloneDeep'
    import NavBar from '@/views/common/NavBar'
    import { LayoutApi } from '@/api/layoutApi'
    import { DashboardApi } from '@/api/dashboardApi'
    import DeleteLayout from '@/views/common/DeleteLayout'
    import DashboardSettings from '@/views/DashboardSettings/sections/DashboardSettings'
    import ColorParameterType from '@/views/DashboardSettings/LayoutManagement/components/ColorParameterType'
    
    export default {
        components: {
            NavBar,
            DeleteLayout,
            ColorParameterType,
            DashboardSettings,
            [Popover.name]: Popover,
        },
        data() {
            return {
                model: {},
                loading: false,
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
        },
        methods: {
            onDiscard(goBack = false) {
                this.layoutSettings = cloneDeep(this.storedDashboardLayout)
                this.$store.dispatch('layout/updateActiveLayout', this.layoutSettings)
                if (goBack) {
                    this.$router.push('/')
                }
            },
            async onSubmit() {
                try {
                    this.loading = true
                    this.model['DashboardLayoutID'] = this.activeLayout.LayoutID
                    
                    await DashboardApi.update(this.model)
                    await LayoutApi.update(this.activeLayout)
                    this.$store.commit('layout/SET_ACTIVE_LAYOUT', this.activeLayout)
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                }
            },
        },
        watch: {
            activeDashboard: {
                immediate: true,
                deep: true,
                handler(dashboard) {
                    this.model = dashboard
                },
            },
        },
    }
</script>
