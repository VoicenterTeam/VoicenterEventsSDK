<template>
    <modal v-bind="$attrs" :width="dialogWidth" v-on="$listeners">
        <h3 class="text-main-xl font-semibold text-gray-700" slot="title">
            {{$t('Update status')}}</h3>
        <div class="py-5">
            {{ promptMessage }} <strong>({{LayoutName}})</strong>
        </div>
        <div v-if="dashboardsWithThisLayout.length" class="pb-5">
            <el-alert
                :title="$t('This layout config is already used')"
                type="warning"
                effect="dark"
                :closable="closable"
                show-icon>
                <div v-html="getMessage"/>
            </el-alert>
            <el-select
                v-model="layoutToReplace"
                class="w-full py-5">
                <el-option
                    :key="layout.LayoutID"
                    :label="layout.LayoutName"
                    :value="layout.LayoutID"
                    v-for="layout in accountLayouts">
                    <div class="flex items-center">
                        <span class="w-6 h-6 rounded" :style="layout.primaryColorBox"></span>
                        <p class="px-2">{{layout.LayoutName}}</p>
                    </div>
                </el-option>
            </el-select>
        </div>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button
                :disabled="isDisabled"
                :loading="loading"
                @click="onSubmit"
                type="primary">{{$t('common.confirm')}}
            </el-button>
        </template>
    </modal>
</template>
<script>
    import {Alert, Option, Select} from 'element-ui'
    import Modal from '@/components/Common/Modal'
    import {statusDictionary} from '../layout-management'
    import {getLayoutsWithPrimaryColor} from "@/helpers/layoutUtil";
    import {DashboardApi} from "@/api/dashboardApi";

    export default {
        name: 'update-status',
        components: {
            Modal,
            [Alert.name]: Alert,
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            dialogWidth: {
                type: String,
                default: '30%'
            },
            layoutConfig: {
                type: Object,
                default: () => ({})
            },
            statusToSet: {
                type: Number,
                default: ''
            },
            closable: {
                type: Boolean,
                default: false
            },
            currentAccountId: {
                type: Number,
                default: 1
            },
        },
        data() {
            return {
                accountLayouts: [],
                layoutToReplace: null,
                loading: false,
                disabled: false,
                layoutID: this.layoutConfig.LayoutID,
                LayoutName: this.layoutConfig.LayoutName,
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
                    dashboards += `${ dashboard.DashboardTitle }.. `
                })

                return `${ this.$t('You must select another configuration for these dashboards:') } <br> <strong> ${ dashboards } </strong>`
            },
        },
        methods: {
            async onSubmit() {
                try {
                    this.loading = true

                    for (const dashboard of this.dashboardsWithThisLayout) {
                        dashboard['DashboardLayoutID'] = this.layoutToReplace
                        await DashboardApi.update(dashboard)
                    }

                    const objToEmit = {
                        LayoutID: this.layoutID,
                        status: this.statusToSet
                    }

                    this.$emit('on-update', objToEmit)

                } catch (e) {
                    console.warn(e)
                } finally {
                }
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            },
            async getAccountLayouts() {
                try {
                    const accountID = this.currentAccountId
                    this.accountLayouts = await getLayoutsWithPrimaryColor(accountID, this.layoutID)
                } catch (e) {
                    console.warn(e)
                }
            },
        },
        created() {
            this.getAccountLayouts()
        }
    }
</script>
