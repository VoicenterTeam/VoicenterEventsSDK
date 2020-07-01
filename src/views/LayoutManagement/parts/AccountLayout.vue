<template>
    <div>
        <GlobalLayout
            @on-apply-layout="applyLayout"
            :dashboardLayoutID="dashboardLayoutID"/>
        <div class="pt-2">{{ $t('Account Layouts') }}</div>
        <el-tabs
            v-model="activeTab">
            <div class="pb-4">
                <el-tooltip
                    class="item" effect="dark" :content="$t('Clone default Dashboard layout')"
                    placement="top">
                    <el-button @click="newLayout">{{$t('New layout')}}</el-button>
                </el-tooltip>
            </div>
            <el-tab-pane v-for="layout in availableLayouts" v-bind="layout">
                <el-collapse
                    class="w-full"
                    v-model="activeCollapses">
                    <el-collapse-item
                        class="w-full"
                        v-for="layoutConfig in getData(layout.statusID)"
                        :name="layoutConfig.LayoutID"
                        :key="layoutConfig.LayoutID">
                        <template slot="title">
                            <div class="flex flex justify-between w-full items-center"
                                 v-if="layoutConfig.LayoutID !== dashboardLayoutID">
                                <div class="flex justify-between w-full">
                                    <div class="flex items-center">
                                        <el-tooltip
                                            class="item" effect="dark" :content="$t('Apply layout')"
                                            placement="top">
                                            <CopyIcon
                                                v-if="layout.statusID === ENABLED_STATUS_ID"
                                                class="w-4 text-primary" @click.stop="applyLayout(layoutConfig)"/>
                                        </el-tooltip>
                                        <div class="px-2">{{layoutConfig.LayoutName}}</div>
                                    </div>
                                </div>
                                <div>
                                    <el-tooltip
                                        v-if="layout.statusID === ENABLED_STATUS_ID"
                                        class="item" effect="dark"
                                        :content="$t('Move layout to bin')"
                                        placement="top">
                                        <Trash2Icon
                                            class="text-red w-4 mx-2"
                                            @click.stop="changeLayoutStatus(layoutConfig, DELETED_STATUS_ID)"/>
                                    </el-tooltip>
                                    <el-tooltip
                                        v-if="layout.statusID === DELETED_STATUS_ID" class="item" effect="dark"
                                        :content="$t('Restore layout')"
                                        placement="top">
                                        <RotateCcwIcon class="text-primary w-4 mx-2"
                                                       @click.stop="changeLayoutStatus(layoutConfig, ENABLED_STATUS_ID)"></RotateCcwIcon>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div v-else>
                                <div class="flex justify-between w-full text-primary">
                                    <div class="flex items-center">
                                        <el-tooltip
                                            class="item" effect="dark" :content="$t('Current dashboard layout')"
                                            placement="top">
                                            <CheckCircleIcon
                                                class="w-4"/>
                                        </el-tooltip>
                                        <div class="px-2">{{layoutConfig.LayoutName}}</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div :key="layoutConfig.LayoutID">
                            <div class="py-4 flex flex-col border-b">
                                <label class="pb-2">{{$t('Layout Name')}}</label>
                                <el-input v-model="layoutConfig.LayoutName"/>
                            </div>
                            <layout-wrapper :key="layoutConfig.LayoutID" :layout="layoutConfig"/>
                            <div class="pt-4 flex justify-between">
                                <el-button
                                    :disabled="storingData"
                                    :loading="storingData"
                                    @click="resetChanges()">
                                    {{$t('common.cancel')}}
                                </el-button>
                                <el-button
                                    :disabled="storingData"
                                    :loading="storingData"
                                    @click="updateLayout(layoutConfig)"
                                    type="primary">{{$t('common.save')}}
                                </el-button>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import {LayoutApi} from '@/api/layoutApi'
    import {CheckCircleIcon, CopyIcon, RotateCcwIcon, Trash2Icon} from 'vue-feather-icons'
    import {availableLayouts, DELETED_STATUS_ID, ENABLED_STATUS_ID, statusDictionary} from '../layout-management'
    import {Collapse, CollapseItem, Notification, TabPane, Tabs, Tooltip} from 'element-ui'
    import {DashboardApi} from '@/api/dashboardApi'
    import LayoutWrapper from './LayoutWrapper'
    import {defaultLayout} from '@/enum/default-layout'
    import GlobalLayout from './GlobalLayout'

    export default {
        components: {
            LayoutWrapper,
            GlobalLayout,
            CopyIcon,
            Trash2Icon,
            CheckCircleIcon,
            RotateCcwIcon,
            [Tabs.name]: Tabs,
            [Tooltip.name]: Tooltip,
            [TabPane.name]: TabPane,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        props: {
            dashboardLayoutID: {
                type: Number,
                default: 1
            },
            currentAccountId: {
                type: Number,
                default: 1
            },
            activeDashboard: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                activeTab: 'enabledLayouts',
                accountLayouts: [],
                activeCollapses: [],
                availableLayouts,
                storingData: false,
                ENABLED_STATUS_ID,
                DELETED_STATUS_ID,
            }
        },
        methods: {
            getData(layoutStatus) {
                return this.accountLayouts.filter((layout) => layout.LayoutStatusID === layoutStatus)
            },
            async getAccountLayouts() {
                try {
                    let accountSettings = {
                        LayoutAccountID: this.currentAccountId
                    }
                    this.accountLayouts = await LayoutApi.get(accountSettings)
                } catch (e) {
                    this.accountLayouts = []
                    console.warn(e)
                } finally {
                }
            },
            async updateLayout(layoutConfig) {
                try {
                    this.storingData = true
                    await LayoutApi.update(layoutConfig)

                    if (layoutConfig.LayoutID === this.dashboardLayoutID) {
                        this.$emit('refresh-current-layout')
                        this.$store.commit('layout/SET_ACTIVE_LAYOUT', layoutConfig)
                    }

                } catch (e) {
                    console.warn(e)
                } finally {
                    this.storingData = false
                }
            },
            async resetChanges() {
                this.activeCollapses = []
                return this.getAccountLayouts()
            },
            async applyLayout(layoutConfig) {
                try {
                    this.storingData = true
                    const dashboard = this.activeDashboard
                    dashboard['DashboardLayoutID'] = layoutConfig.LayoutID
                    await DashboardApi.update(dashboard)
                    await this.$store.dispatch('dashboards/updateDashboard', dashboard)

                    this.$store.commit('layout/SET_ACTIVE_LAYOUT', layoutConfig)
                    Notification.success(this.$t('Layout applied with success'))
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.storingData = false
                }
            },
            async changeLayoutStatus(layoutConfig, status) {
                let message = statusDictionary[status]
                this.$confirm(
                    this.$t('common.confirm.question', {
                        action: this.$t(message),
                    }), this.$t('Update status'), {
                        cancelButtonText: this.$t('common.cancel'),
                        confirmButtonText: this.$t('common.confirm'),
                    }).then(() => {
                    try {

                        let data = {
                            LayoutID: layoutConfig.LayoutID,
                            LayoutStatus: status,
                            LayoutAccountID: this.currentAccountId,
                        }

                        LayoutApi.updateStatus(data)
                        this.getAccountLayouts()
                    } catch (e) {
                        console.warn(e)
                    } finally {
                    }
                })

            },
            async newLayout() {
                try {
                    this.activeTab = 'enabledLayouts'
                    this.storingData = true
                    let layout = defaultLayout(this.currentAccountId)

                    await LayoutApi.update(layout)
                    await this.getAccountLayouts()
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.storingData = false
                }
            },
        },
        mounted() {
            this.getAccountLayouts()
        },
    }
</script>
