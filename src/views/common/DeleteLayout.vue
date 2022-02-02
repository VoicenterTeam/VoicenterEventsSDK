<template>
    <modal :append-to-body="true"
           v-bind="$attrs"
           v-on="$listeners"
           :width="modalWidth">
        <h3 class="text-main-xl font-semibold text-gray-700"
            slot="title">
            {{ $t('general.deleteConfirmation') }}
        </h3>
        <div class="py-4">
            {{ promptMessage }}<br>
            <strong>({{ LayoutName }})</strong>
        </div>
        <div v-if="layoutID && dashboardsWithThisLayout.length" class="pb-5">
            <el-alert
                :title="$t('layout.thisLayoutConfigIsAlreadyUsed')"
                type="warning"
                effect="dark"
                :closable="closable"
                show-icon>
                <div v-html="getMessage"/>
            </el-alert>
            <LayoutSelect class="mt-4"
                          :default-layout="globalLayout"
                          :hide-layout-id="layoutToRemove.LayoutID"
                          @on-chose-layout="onChoseLayout"/>
        </div>
        <template v-slot:footer>
            <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                <base-button class="mx-4"
                             outline
                             fixed-width="w-37"
                             @click="$emit('on-close')">
                    <div class="flex items-center">
                        <IconDiscard class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ 'Cancel' }}</span>
                    </div>
                </base-button>
                <base-button fixed-width="w-37"
                             :loading="loading"
                             type="danger"
                             @click="onDelete">
                    <div class="flex items-center">
                        <IconDelete class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ 'Delete' }}</span>
                    </div>
                </base-button>
            </div>
        </template>

    </modal>
</template>
<script>
    import { LayoutApi } from '@/api/layoutApi'
    import Modal from '@/components/Common/Modal'
    import { DashboardApi } from '@/api/dashboardApi'
    import { Alert, Option, Select } from 'element-ui'
    import LayoutSelect from '@/views/common/LayoutSelect'
    import { statusDictionary } from '@/views/DashboardSettings/LayoutManagement/layout-management'

    export default {
        components: {
            Modal,
            LayoutSelect,
            [Alert.name]: Alert,
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            isActiveLayout: {
                type: Boolean,
                default: false,
            },
            layoutToRemove: {
                type: Object,
                default: () => ({}),
            },
            statusToSet: {
                type: Number,
                default: 2,
            },
            statusNameToSet: {
                type: String,
                default: 'Deleted',
            },
            closable: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                globalLayout: 1,
                modalWidth: '500px',
                accountLayouts: [],
                layoutToReplace: 1,
                loading: false,
                layoutID: this.layoutToRemove.LayoutID,
                LayoutName: this.layoutToRemove.LayoutName,
            }
        },
        computed: {
            promptMessage() {
                const message = statusDictionary[this.statusToSet]
                return this.$t('common.confirm.question', {
                    action: this.$t(message),
                })
            },
            allDashboards() {
                return this.$store.state.dashboards.allDashboards
            },
            dashboardsWithThisLayout() {
                return this.allDashboards.filter(dashboard => dashboard.DashboardLayoutID.toString() === this.layoutID.toString())
            },
            isDisabled() {
                return !!(this.dashboardsWithThisLayout.length && !this.layoutToReplace);
            },
            getMessage() {
                let dashboards = ''
                this.dashboardsWithThisLayout.forEach((dashboard) => {
                    dashboards += `${dashboard.DashboardTitle}.. `
                })
                return `${this.$t('dashboard.youMustSelectAnotherConfiguration')} <br> <strong> ${dashboards} </strong>`
            },
            getAccountLayouts() {
                return this.$store.state.layout.data || []
            },
        },
        methods: {
            onChoseLayout(id) {
                this.layoutToReplace = id
            },
            getLayoutToReplace(LayoutID) {
                return this.getAccountLayouts.filter(layout => layout.LayoutID.toString() === LayoutID.toString())
            },
            async onDelete() {
                try {
                    this.loading = true
                    if (this.layoutID) {
                        const dashboardsWithThisLayout = this.dashboardsWithThisLayout

                        const newLayoutID = this.layoutToReplace === 1 ? this.layoutToReplace: this.layoutToReplace.LayoutID

                        for (const dashboard of dashboardsWithThisLayout) {
                            dashboard['DashboardLayoutID'] = newLayoutID
                            await DashboardApi.update(dashboard)
                            this.layoutID = newLayoutID
                        }

                        if (this.isActiveLayout) {
                            const layout = this.getLayoutToReplace(newLayoutID)
                            if (!layout.length) {
                                return
                            }
                            await this.$store.dispatch('layout/updateActiveLayout', layout[0])
                        }
                    }

                    const layoutSettings = {
                        ...this.layoutToRemove,
                        LayoutStatusID: this.statusToSet,
                        LayoutStatusName: this.statusNameToSet,
                    }

                    await LayoutApi.update(layoutSettings)
                    await this.$store.dispatch('layout/setupLayouts')
                    await this.$store.dispatch('layout/getGlobalLayout')
                    this.$emit('on-close')
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                }
            },
        },
    }
</script>
