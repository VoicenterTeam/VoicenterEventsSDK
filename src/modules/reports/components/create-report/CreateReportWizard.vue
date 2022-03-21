<template>
    <wizard 
        :entity-name="$t('account.entityName')"
        :step-index="0"
        ref="wizard"
        :data-loading="loading || validationLoading"
        data-test-name="account-add"
        :model="model"
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

        <wizard-step icon="vc-icon-id"
                    v-loading="loading"
                    :name="$t('report.wizard.idStep')"
                    :title="$t('report.wizard.idStep')"
                    class="flex items-center">

            <template v-slot:summary>
                <wizard-summary-row
                    :label="`${$t('report.wizard.idStep')}:`"
                    :value="getReportData.ReportItemList.length"
                />
            </template>

            <create-report-step-second /> <!-- TODO: need to add ref (idStep) -->
        </wizard-step>

        <wizard-step
            icon="vc-icon-filter"
            v-loading="loading"
            :name="$t('report.wizard.finalStep')"
            :title="$t('report.wizard.finalStep')"
        >

            <template v-slot:summary>
                <wizard-summary-row
                    :label="`${$t('report.scheduleList.length')}:`"
                    :value="getReportData.ReportTriggerList.length"
                />
            </template>

            <create-report-step-third ref="finalStep" />
        </wizard-step>

    </wizard>
</template>

<script>
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
            }
        },
        methods: {
            validateGeneralStep() {
                return this.$refs['generalStep'].validate()
            },
            validateIdStep() {
                return this.$refs['idStep'].validate()
            },
            validateFinalStep() {
                return this.$refs['finalStep'].validate()
            },
            async onFinish() {
                this.validationLoading = true
                const isValid = await this.validateFinalStep();

                if (!isValid) {
                    this.validationLoading = false
                    return
                }
            },
            async onCancel() {
                this.$emit('on-cancel');
            }
        },
        created() {
            this.$store.dispatch('reportTrigger/updateValueOfCreateLocalReportTrigger', true)
        },
        beforeDestroy () {
            this.$store.dispatch('reportTrigger/updateValueOfCreateLocalReportTrigger', false)
        }
    }
</script>
