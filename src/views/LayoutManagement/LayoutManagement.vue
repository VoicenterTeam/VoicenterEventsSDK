<template>
    <div class="flex flex-col bg-white">
        <div class="border-b px-16 flex flex-row justify-between h-14 items-center">
            <img :src="getLogo" alt="Logo" class="h-10">
            <div class="flex items-center">
                <el-button
                    size="mini"
                    class="back-button"
                    @click="redirectBack">
                    <el-tooltip class="item" effect="dark" :content="$t('Back to Dashboard')"
                                placement="top">
                        <div class="flex items-center">
                            <ArrowLeftIcon class="w-4"/>
                            <span class="px-1 text-main-sm">{{$t('Back to Dashboard')}}</span>
                        </div>
                    </el-tooltip>
                </el-button>
                <span class="mx-4 account-details">{{activeDashboard.DashboardTitle}}</span>
                <span class="account-details">{{currentAccount.name}}</span>
            </div>
        </div>
        <div class="content-wrapper">
            <div class="layouts-container">
                <p class="text-center py-2">{{$t('Current Layout Config')}}</p>
                <div v-if="activeLayout">
                    <div class="py-4 flex flex-col border-b">
                        <label class="pb-2">{{$t('Layout Name')}}</label>
                        <el-input v-model="activeLayout.LayoutName"/>
                    </div>
                    <div v-for="layoutParameter in activeLayout.LayoutParametersList">
                        <component
                            v-bind="layoutParameter"
                            :is="layoutParameter.ParameterTypeName"
                            v-model="layoutParameter.Value"
                        />
                    </div>
                    <div class="pt-4 flex justify-end">
                        <el-button
                            :disabled="storingData"
                            :loading="storingData"
                            @click="updateLayout(activeLayout)"
                            type="primary">{{$t('common.save')}}
                        </el-button>
                    </div>
                </div>
                <div v-else>
                </div>
            </div>
            <div class="layouts-container">
                <el-tabs v-model="activeTab">
                    <el-tab-pane v-for="layout in availableLayouts" v-bind="layout">
                        <el-collapse class="w-full" v-model="activeCollapses">
                            <el-collapse-item
                                class="w-full "
                                style="max-height: 500px; overflow: scroll;"
                                v-for="layoutConfig in getData(layout.data)"
                                :name="layoutConfig.LayoutID"
                                :key="layoutConfig.LayoutID">
                                <template slot="title">
                                    <el-tooltip class="item" effect="dark" :content="$t('Apply layout')"
                                                placement="top">
                                        <LinkIcon class="w-4 text-primary" @click.stop="applyLayout(layoutConfig)"/>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="$t('Clone layout')"
                                                placement="top">
                                        <CopyIcon v-if="layout.key !== ACCOUNT_LAYOUTS_KEY"
                                                  class="mx-2 w-4 text-primary"
                                                  @click.stop="cloneLayout(layoutConfig)"/>
                                    </el-tooltip>
                                    <div class="px-2">{{layoutConfig.LayoutName}}</div>
                                </template>
                                <div v-if="layout.key === ACCOUNT_LAYOUTS_KEY" class="py-4 flex flex-col border-b">
                                    <label class="pb-2">{{$t('Layout Name')}}</label>
                                    <el-input v-model="layoutConfig.LayoutName"/>
                                </div>
                                <div v-for="layoutParameter in layoutConfig.LayoutParametersList">
                                    <component
                                        v-bind="layoutParameter"
                                        :is="layoutParameter.ParameterTypeName"
                                        v-model="layoutParameter.Value"
                                    />
                                </div>
                                <div v-if="layout.key === ACCOUNT_LAYOUTS_KEY" class="pt-4 flex justify-end">
                                    <el-button
                                        :disabled="storingData"
                                        :loading="storingData"
                                        @click="updateLayout(layoutConfig)"
                                        type="primary">{{$t('common.save')}}
                                    </el-button>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {LayoutApi} from '@/api/layoutApi'
    import {ArrowLeftIcon, CopyIcon, LinkIcon} from 'vue-feather-icons'
    import {ACCOUNT_LAYOUTS_KEY, availableLayouts, globalAccountSettings} from './layout-management-config'
    import {Collapse, CollapseItem, TabPane, Tabs, Tooltip} from 'element-ui'
    import ColorParameterType from './components/ColorParameterType'
    import IntegerParameterType from './components/IntegerParameterType'
    import BooleanParameterType from './components/BooleanParameterType'
    import {DashboardApi} from '@/api/dashboardApi'

    export default {
        components: {
            [ColorParameterType.name]: ColorParameterType,
            [BooleanParameterType.name]: BooleanParameterType,
            [IntegerParameterType.name]: IntegerParameterType,
            LinkIcon,
            CopyIcon,
            ArrowLeftIcon,
            [Tabs.name]: Tabs,
            [Tooltip.name]: Tooltip,
            [TabPane.name]: TabPane,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        data() {
            return {
                activeTab: 'accountLayouts',
                globalLayouts: [],
                accountLayouts: [],
                activeLayout: {},
                activeCollapses: [],
                availableLayouts,
                ACCOUNT_LAYOUTS_KEY,
                storingData: false,
            }
        },
        computed: {
            activeDashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            getDashboardLayoutID() {
                return get(this.activeDashboard, 'DashboardLayoutID', null);
            },
            currentAccount() {
                return this.$store.getters['entities/getCurrentAccount']
            },
            getLogo() {
                return get(this.activeDashboard, 'DashboardLayout.settings.logo') || '/img/navbar/logo.png'
            },
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
        },
        methods: {
            redirectBack() {
                this.$router.go(-1)
            },
            getData(layoutType) {
                return this[layoutType]
            },
            async getGlobalLayouts() {
                try {
                    this.globalLayouts = await LayoutApi.get(globalAccountSettings)
                } catch (e) {
                    console.warn(e)
                } finally {
                }
            },
            async getAccountLayouts() {
                try {
                    let accountSettings = {
                        "LayoutAccountID": this.currentAccountId
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
                    await this.getAccountLayouts()
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.storingData = false
                }
            },
            async applyLayout(layoutConfig) {
                try {
                    this.storingData = true
                    const dashboard = this.activeDashboard
                    dashboard['DashboardLayoutID'] = layoutConfig.LayoutID
                    await DashboardApi.update(dashboard)
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.storingData = false
                }
            },
            async activeDashboardLayout() {
                try {
                    const dashboardLayoutID = this.getDashboardLayoutID
                    const data = {
                        LayoutID: dashboardLayoutID
                    }
                    const layout = await LayoutApi.get(data)
                    this.activeLayout = get(layout, '[0]', {})
                } catch (e) {
                    console.warn(e)
                } finally {
                }
            },
            cloneLayout(layoutConfig) {
                layoutConfig['LayoutAccountID'] = this.currentAccountId
                delete layoutConfig.LayoutID
                this.updateLayout(layoutConfig)
                this.activeTab = 'accountLayouts'
            }
        },
        mounted() {
            this.getGlobalLayouts()
            this.getAccountLayouts()
            this.activeDashboardLayout()
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
        @apply px-6 py-8 flex flex-row w-full;

        .layouts-container {
            @apply w-1/2 mx-2 px-5 py-4 border rounded min-h-screen;

            /deep/ div.el-collapse .el-collapse-item__content {
                padding: 0 1rem 1rem;
            }
        }
    }
</style>
