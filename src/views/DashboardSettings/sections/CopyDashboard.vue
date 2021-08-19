<template>
    <div>
        <el-tooltip effect="dark"
                    :content="$t('Copy Dashboard')"
                    :open-delay="openDelay"
                    placement="top">
            <base-button @click="showDialog = true"
                         variant="discard"
                         fixed-width="w-37">
                <div class="flex items-center">
                    <CopyIcon class="w-4-5 h-4-5"/>
                    <span class="mx-1 text-base font-bold">{{ $t('Copy') }}</span>
                </div>
            </base-button>
        </el-tooltip>
        <Modal :visible.sync="showDialog"
               :append-to-body="true">
            <template v-slot:title>
                <h3 class="text-main-2xl font-semibold text-gray-700">
                    {{ $t('Copy Dashboard') }}
                </h3>
            </template>
            <div class="py-5">
                <p class="mb-4">
                    {{ $t('Account') }}
                    ({{ $t('copy dashboard into selected account') }})
                </p>
                <base-select :data="allAccounts"
                             labelKey="name"
                             valueKey="ID"
                             :multiple="false"
                             class="w-full mb-2"
                             v-model="account"/>
                <el-collapse v-model="activeCollapse"
                             class="mt-3">
                    <el-collapse-item v-for="group in widgetGroups"
                                      class="my-2"
                                      :title="groupTitle(group)"
                                      :key="group.WidgetGroupID"
                                      :name="group.WidgetGroupID"
                    >
                        <template slot="title">
                            <el-checkbox :value="group.isSelected"
                                         @change.native.stop="toggleSelection(group)"/>
                            <span class="mx-2">
                                {{ group.WidgetGroupTitle }}
                            </span>
                        </template>
                        <div v-if="displayWidgetList"
                             v-for="widget in group.WidgetList"
                             :key="widget.WidgetID"
                             class="w-full flex items-center">
                            <el-checkbox :value="widget.isSelected"
                                         @change="toggleSelection(widget)"/>
                            <component class="text-primary my-1 mx-2"
                                       :is="getWidgetIcon(widget)"/>
                            <span class="flex-1 truncate">
                                {{ widget.Title }}
                            </span>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <template v-slot:footer>
                <div class="border-t-2 border-gray-300 py-4 flex items-center justify-between px-6">
                    <base-button class="md:mx-4"
                                 @click="showDialog = false"
                                 variant="discard"
                                 fixed-width="w-37">
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="font-semibold">{{ 'Cancel' }}</span>
                        </div>
                    </base-button>
                    <base-button @click="onCopy"
                                 key="new-layout"
                                 fixed-width="w-37"
                                 :loading="loading">
                        <span class="font-semibold">
                            {{ $t('Confirm') }}
                        </span>
                    </base-button>
                </div>
            </template>
        </Modal>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import pick from 'lodash/pick'
    import { CopyIcon } from 'vue-feather-icons'
    import Modal from '@/components/Common/Modal'
    import { templateIcons } from '@/enum/widgetDataTypes'
    import { Collapse, CollapseItem, Checkbox } from 'element-ui'
    import { WidgetApi } from '@/api/widgetApi'
    import { DashboardApi } from '@/api/dashboardApi'
    import { WidgetGroupsApi } from '@/api/widgetGroupApi'
    
    export default {
        components: {
            Modal,
            CopyIcon,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        props: {
            dashboard: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                activeCollapse: [],
                loading: false,
                openDelay: 200,
                showDialog: false,
                account: null,
                displayWidgetList: true,
            }
        },
        computed: {
            widgetGroups() {
                return this.dashboard.WidgetGroupList || []
            },
            allAccounts() {
                return this.$store.getters['entities/accountsList']
            },
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
        },
        methods: {
            groupTitle(group) {
                return group.WidgetGroupTitle ? this.$t(group.WidgetGroupTitle) : `${this.$t('Group')} #${group.WidgetGroupID}`
            },
            getWidgetIcon(widget) {
                const { DataTypeID } = widget.WidgetLayout
                return templateIcons[DataTypeID]
            },
            toggleSelection(group) {
                this.displayWidgetList = false
                group.isSelected = !group.isSelected
                this.$nextTick(() => {
                    this.displayWidgetList = true
                })
            },
            async onCopy() {
                try {
                    this.loading = true
                    let payload = pick(this.dashboard, ['GroupTransitionTimer', 'DashboardTitle', 'DashboardLayoutID', 'DashboardLayout', 'DashBoardsPermission', 'DashBoardsUserPermission'])
                    payload.AccountID = this.account
                    payload.DashboardTitle = `${payload.DashboardTitle} - copy`
                    const newDashboardData = await DashboardApi.store(payload)
                    const { DashboardID } = newDashboardData
                    await this.addWidgetGroups(DashboardID)
                    let WidgetGroupID = get(newDashboardData.WidgetGroupList, '[0].WidgetGroupID' ,false)
                    if (WidgetGroupID) {
                        await DashboardApi.removeWidgetGroup(DashboardID, WidgetGroupID)
                    }
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                    this.showDialog = false
                }
            },
            async addWidgetGroups(DashboardID) {
                for (let i = 0; i < this.widgetGroups.length; i++) {
                    const group = this.widgetGroups[i]
                    if (!group.isSelected) {
                        return
                    }
                    const payload = {
                        Order: group.Order,
                        WidgetGroupTitle: group.WidgetGroupTitle,
                        WidgetList: [],
                    }
                    const { WidgetGroupID } = await WidgetGroupsApi.store(payload)
                    
                    await DashboardApi.addWidgetGroup(DashboardID, WidgetGroupID)
                    this.addWidgets(group.WidgetList, WidgetGroupID)
                }
            },
            async addWidgets(widgets, WidgetGroupID) {
                for (let i = 0; i < widgets.length; i++) {
                    const widget = widgets[i]
                    
                    if (!widget.isSelected) {
                        return
                    }
                    const payload = {
                        ...widget,
                        WidgetEntity: [],
                    }
                    delete payload.WidgetID
                    delete payload.LastUpdate
                    delete payload.isSelected
                    
                    const { WidgetID } = await WidgetApi.store(payload)
                    if (!WidgetID) {
                        return
                    }
                    WidgetGroupsApi.addWidget(WidgetGroupID, WidgetID)
                }
            },
            fillAccount() {
                this.account = this.currentAccountId
            },
        },
        mounted() {
            this.widgetGroups.forEach((group) => {
                group['isSelected'] = true
                group.WidgetList.forEach(widget => {
                    widget['isSelected'] = true
                })
            })
            this.fillAccount()
        },
    }
</script>
