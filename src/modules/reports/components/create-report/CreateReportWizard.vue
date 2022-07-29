<template>
    <wizard 
        :entity-name="$t('account.entityName')"
        :step-index="0"
        ref="wizard"
        :data-loading="loading || validationLoading"
        data-test-name="account-add"
        @finish="onFinish"
        @on-cancel="onCancel"
    >

        <wizard-step 
            icon="vc-icon-extensions"
            v-loading="loading"
            :name="$t('report.wizard.generalStep')"
            :title="$t('account.wizard.generalStep')"
            class="flex items-center"
            :before-leave="validateGeneralStep"
        >

            <template v-slot:summary>
                <wizard-summary-row
                    :label="`${$t('report.name')}:`"
                    :value="getReportData.ReportName"
                />
                <wizard-summary-row
                    :label="`${$t('report.status')}:`"
                    :value="getReportData.ReportStatusID"
                />
            </template>

            <create-report-step-first ref="generalStep" />

        </wizard-step>

        <wizard-step
            icon="vc-icon-id"
            v-loading="loading"
            :name="$t('report.wizard.idStep')"
            :title="$t('report.wizard.idStep')"
            class="flex items-center"
            :before-leave="validateIdStep"
        >

            <template v-slot:summary>
                <wizard-summary-row
                    :label="`${$t('report.wizard.idStep')}:`"
                    :value="getReportData.ReportItemList.length"
                />
            </template>

            <create-report-step-second ref="stepTwo" />
        </wizard-step>

        <wizard-step
            icon="vc-icon-filter"
            v-loading="loading"
            :name="$t('report.wizard.finalStep')"
            :title="$t('report.wizard.finalStep')"
        >

            <template v-slot:summary>
                <wizard-summary-row
                    :label="`${$t('report.wizard.finalStep')}:`"
                    :value="getReportData.ReportTriggerList.length"
                />
            </template>

            <create-report-step-third ref="finalStep" />
        </wizard-step>

    </wizard>
</template>

<script>
    import { reportApi } from '@/modules/reports/services/reportService'
    import { Notification } from 'element-ui'

    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            }
        },
        components: {
            CreateReportStepFirst: () => import('./CreateReportStepFirst.vue'),
            CreateReportStepSecond: () => import('./CreateReportStepSecond.vue'),
            CreateReportStepThird: () => import('./CreateReportStepThird.vue'),
            Wizard: () => import('@/modules/reports/components/wizard/Wizard'),
            WizardStep: () => import('@/modules/reports/components/wizard/WizardStep'),
            WizardSummaryRow: () => import('@/modules/reports/components/wizard/WizardSummaryRow')
        },
        data() {
            return {
                validationLoading: false
            }
        },
        computed: {
            getReportData () {
                return this.$store.getters['report/getReportData']
            },
            currentAccountId () {
                return this.$store.state.entities.selectedAccountID
            },
            selectedLayout() {
                return this.$store.state.layout.activeLayout.LayoutID
            },
        },
        methods: {
            validateGeneralStep() {
                return this.$refs['generalStep'].validate()
            },
            validateIdStep() {
                const isValid = this.$refs['stepTwo'].$refs.widgetTable.validate()
                if (!isValid) {
                    Notification.warning(this.$t('report.schedule.needAddAtLeastOneWidget'))
                    return
                }
                return isValid
            },
            async onFinish() {
                const isValid = this.$refs['finalStep'].validate()
                if (!isValid) {
                    Notification.warning(this.$t('report.schedule.needAddAtLeastOneSchedule'))
                    return
                }

                const data = await this.getReportData
                data.AccountID = this.currentAccountId
                data.LayoutID = this.selectedLayout
                try {
                    await reportApi.store(data)
                    this.$emit('go-back');
                } catch (errors) {
                    console.error(errors);
                }
            },
            async onCancel() {
                this.$emit('go-back');
            }
        },
        created () {
            this.$store.dispatch('reportTrigger/updateValueOfCreateLocalReportTrigger', true)
        },
        beforeDestroy () {
            this.$store.dispatch('reportTrigger/updateValueOfCreateLocalReportTrigger', false)
        }
    }
</script>
