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
        class="mx-14"
    >

        <wizard-step 
            icon="vc-icon-extensions"
            v-loading="loading"
            :name="$t('account.wizard.generalStep')"
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
                    :name="$t('account.wizard.idStep')"
                    :title="$t('account.wizard.idStep')"
                    class="flex items-center">

            <template v-slot:summary>
                <!-- TODO: need to add summaries -->
            </template>

            <create-report-step-second /> <!-- TODO: need to add ref (idStep) -->
        </wizard-step>

        <wizard-step
            icon="vc-icon-filter"
            v-loading="loading"
            :name="$t('account.wizard.finalStep')"
            :title="$t('account.wizard.finalStep')"
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
            async onFinish({createAnotherData}) {
                this.validationLoading = true
                const isValid = await this.validateFinalStep();

                if (!isValid) {
                    this.validationLoading = false
                    return
                }

                // try {
                //     if (!this.model.AvatarID) {
                //         let params = {
                //             AvatarAccountID: Number(this.model.ParentAccount),
                //             AvatarData: {
                //                 Hex: this.avatarColor,
                //                 Content: this.nameInitials
                //             }
                //         };
                //         let {data} = await generateDefaultAvatar(params);
                //         this.model.AvatarID = get(data, 'AvatarID', '')
                //     }

                //     this.$emit('submit', {
                //         data: this.model,
                //         createAnotherData
                //     })
                // } catch (e) {
                //     console.error(e)
                // } finally {
                //     this.validationLoading = false
                // }
            },
            async onCancel() {
                // const params = {
                //     title: this.$t('general.cancelConfirmation'),
                //     message: this.$t('general.cancelConfirmationText'),
                //     type: 'confirm-cancel'
                // };

                // const result = await this.$confirmModal(params);

                // if (!result) {
                //     return
                // }
                // await this.refresh();
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
