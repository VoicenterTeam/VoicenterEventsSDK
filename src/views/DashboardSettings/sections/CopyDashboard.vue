<template>
    <div>
        <el-tooltip effect="dark"
                    :content="$t('dashboard.copyDashboard')"
                    :open-delay="openDelay"
                    placement="top">
            <base-button @click="showDialog = true"
                         variant="discard"
                         fixed-width="w-37">
                <div class="flex items-center">
                    <CopyIcon class="w-4-5 h-4-5"/>
                    <span class="mx-1 text-base font-bold">{{ $t('general.copy') }}</span>
                </div>
            </base-button>
        </el-tooltip>
        <Modal :visible.sync="showDialog"
               :append-to-body="true">
            <template v-slot:title>
                <h3 class="text-main-2xl font-semibold text-gray-700">
                    {{ $t('dashboard.copyDashboard') }}
                </h3>
            </template>
            <div class="py-5">
                <p class="mb-2">
                    {{ $t('general.account') }}
                    ({{ $t('dashboard.copyDashboardIntoSelectedAccount') }})
                </p>
                <base-select
                    :data="allAccounts"
                    labelKey="name"
                    valueKey="ID"
                    :multiple="false"
                    class="w-full mb-2"
                    v-model="account"/>
                <p class="mb-2">
                    {{ $t('dashboard.newDashboardName') }}
                </p>
                <el-input v-model="dashboardCopy.DashboardTitle"/>
                <el-collapse
                    v-model="activeCollapse"
                    class="mt-3">
                    <el-collapse-item v-for="group in widgetGroups"
                        class="my-2"
                        :title="groupTitle(group)"
                        :key="group.WidgetGroupID"
                        :name="group.WidgetGroupID"
                    >
                        <template slot="title">
                            <el-checkbox :value="group.isSelected"
                                         @change.native.stop="toggleGroupSelection(group)"/>
                            <span class="mx-2">
                                {{ group.WidgetGroupTitle || $t('dashboard.groupID') + ': ' + group.WidgetGroupID }}
                            </span>
                        </template>
                        <template v-if="displayWidgetList">
                            <div
                                v-for="widget in group.WidgetList"
                                :key="widget.WidgetID"
                                class="w-full flex items-center">
                                <el-checkbox
                                    :value="widget.isSelected"
                                    @change="toggleWidgetSelection(widget, group)"
                                />
                                <component class="text-primary my-1 mx-2"
                                        :is="getWidgetIcon(widget)"/>
                                <span class="flex-1 truncate">
                                    {{ widget.Title }}
                                </span>
                            </div>
                        </template>
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
                            {{ $t('common.confirm') }}
                        </span>
                    </base-button>
                </div>
            </template>
        </Modal>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import { CopyIcon } from 'vue-feather-icons'
    import Modal from '@/components/Common/Modal'
    import { templateIcons } from '@/enum/widgetDataTypes'
    import { Collapse, CollapseItem, Checkbox } from 'element-ui'
    import { DashboardApi } from '@/api/dashboardApi'

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
                default: () => ({})
            }
        },
        data() {
            return {
                activeCollapse: [],
                loading: false,
                openDelay: 200,
                showDialog: false,
                account: null,
                displayWidgetList: true,
                dashboardCopy: {
                    ...cloneDeep(this.dashboard),
                    DashboardTitle: `${this.dashboard.DashboardTitle} - Copy`
                }
            }
        },
        computed: {
            widgetGroups() {
                return this.dashboardCopy.WidgetGroupList || []
            },
            allAccounts() {
                return this.$store.getters['entities/accountsList']
            },
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            }
        },
        methods: {
            groupTitle(group) {
                return group.WidgetGroupTitle ? this.$t(group.WidgetGroupTitle) : `${this.$t('general.group')} #${group.WidgetGroupID}`
            },
            getWidgetIcon(widget) {
                const { DataTypeID } = widget.WidgetLayout
                return templateIcons[DataTypeID]
            },
            toggleGroupSelection(group) {
                this.displayWidgetList = false
                group.isSelected = !group.isSelected

                group.WidgetList.forEach(widget => {
                    widget.isSelected = group.isSelected
                })

                this.$nextTick(() => {
                    this.displayWidgetList = true
                })
            },
            toggleWidgetSelection(widget, group) {
                this.displayWidgetList = false
                widget.isSelected = !widget.isSelected

                if(widget.isSelected && !group.isSelected) {
                    group.isSelected = true
                }

                const isFullyUnchecked = !group.WidgetList.some(el => el.isSelected)
                if (isFullyUnchecked) {
                    group.isSelected = false
                }

                this.$nextTick(() => {
                    this.displayWidgetList = true
                })
            },
            async onCopy() {
                const widgetGroupList = this.dashboardCopy.WidgetGroupList
                    .map(widgetGroup => {
                        if (widgetGroup.isSelected) {
                            const newWidgetGroupItem = {}
                            newWidgetGroupItem.WidgetGroupID = widgetGroup.WidgetGroupID
                            newWidgetGroupItem.WidgetList = widgetGroup.WidgetList
                                .filter(el => el.isSelected)
                                .map(el => el.WidgetID) || []
                            return newWidgetGroupItem
                        }
                    })
                    .filter(el => el)

                try {
                    this.loading = true
                    const copiedDashboard = {
                        DashboardID: this.dashboardCopy.DashboardID,
                        DashboardCopyTitle: this.dashboardCopy.DashboardTitle,
                        WidgetGroupCopyList: widgetGroupList
                    }

                    const newDashboard = await DashboardApi.copy(copiedDashboard)

                    await this.$store.dispatch('dashboards/selectDashboard', newDashboard)
                    await this.$store.dispatch('dashboards/getDashboards')
                    await this.$router.push('/')
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                    this.showDialog = false
                }
            },
            fillAccount() {
                this.account = this.currentAccountId
            }
        },
        mounted() {
            this.widgetGroups.map((group) => {
                group['isSelected'] = true
                group.WidgetList.map(widget => {
                    widget['isSelected'] = true
                    return widget
                })
                return group
            })
            this.fillAccount()
        }
    }
</script>
