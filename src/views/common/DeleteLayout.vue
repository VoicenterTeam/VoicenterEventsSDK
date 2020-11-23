<template>
    <modal :append-to-body="true"
           v-bind="$attrs"
           v-on="$listeners"
           :width="modalWidth">
        <h3 class="text-main-xl font-semibold text-gray-700"
            slot="title">
            {{ $t('Delete Confirmation') }}
        </h3>
        <div class="py-4">
            {{ promptMessage }}<br>
            <strong>({{ LayoutName }})</strong>
        </div>
        <div v-if="layoutID && dashboardsWithThisLayout.length" class="pb-5">
            <el-alert
                :title="$t('This layout config is already used')"
                type="warning"
                effect="dark"
                :closable="closable"
                show-icon>
                <div v-html="getMessage"/>
            </el-alert>
            <LayoutSelect class="mt-4"
                          @on-chose-layout="onChoseLayout"/>
        </div>
        <template v-slot:footer>
            <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                <base-button class="mx-4"
                             @click="$emit('on-close')"
                             variant="discard"
                             fixed-width="w-37">
                    <div class="flex items-center">
                        <IconDiscard class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ 'Cancel' }}</span>
                    </div>
                </base-button>
                <base-button fixed-width="w-37"
                             :loading="loading"
                             variant="danger"
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
            activeLayout: {
                type: Object,
                default: () => ({}),
            },
            statusToSet: {
                type: Number,
                default: 2,
            },
            closable: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                modalWidth: '500px',
                accountLayouts: [],
                layoutToReplace: null,
                loading: false,
                layoutID: this.activeLayout.LayoutID,
                LayoutName: this.activeLayout.LayoutName,
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
                return `${this.$t('You must select another configuration for these dashboards:')} <br> <strong> ${dashboards} </strong>`
            },
        },
        methods: {
            onChoseLayout(id) {
                this.layoutToReplace = id
            },
            async onDelete() {
                try {
                    this.loading = true
                    if (this.layoutID) {
                        const dashboardsWithThisLayout = this.dashboardsWithThisLayout
                        
                        for (const dashboard of dashboardsWithThisLayout) {
                            this.layoutID = this.layoutToReplace
                            dashboard['DashboardLayoutID'] = this.layoutToReplace
                            await DashboardApi.update(dashboard)
                        }
                    }
                    
                    const layoutSettings = {
                        ...this.activeLayout,
                        LayoutStatusID: this.statusToSet,
                    }
                    
                    await LayoutApi.update(layoutSettings)
                    await this.$store.dispatch('layout/setupLayouts')
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
