<template>
    <Wizard :entity-name="$t('account.entityName')"
            :step-index="0"
            ref="wizard"
            :data-loading="loading || validationLoading"
            data-test-name="account-add"
            :model="model"
            @finish="onFinish"
            @cancel="onCancel">

        <WizardStep icon="vc-settings"
                    v-loading="loading"
                    :name="$t('account.wizard.generalStep')"
                    :title="$t('account.wizard.generalStep')"
                    :before-leave="validateGeneralStep"
                    class="flex items-center">

            <template v-slot:summary>
                <WizardSummaryRow :label="`${$t('accountForm.general')}:`"
                                  :value="model.AccountName"/>
                <WizardSummaryRow :label="`${$t('accountForm.general')}:`"
                                  :value="summary.parentAccount"/>
                <WizardSummaryRow :label="`${$t('accountForm.genera')}:`"
                                  :value="summary.language"/>
                <WizardSummaryRow :label="`${$t('accountForm.genera')}:`"
                                  :value="summary.timezone"/>
            </template>
<!-- 
            <AccountWizardGeneralStep ref="generalStep"
                                      :account-entity="accountEntity"
                                      :model-validations="modelValidations"
                                      :model="model"
                                      :summary="summary"/> -->

        </WizardStep>

        <WizardStep icon="vc-id"
                    v-loading="loading"
                    :name="$t('account.wizard.idStep')"
                    :title="$t('account.wizard.idStep')"
                    :before-leave="validateIdStep"
                    class="flex items-center">

            <template v-slot:summary>
                <WizardSummaryRow :label="`${$t('accountForm.general.label.mainDID')}:`"
                                  :value="summary.MainDID"/>
                <WizardSummaryRow :label="`${$t('accountForm.general.label.e911CallerID')}:`"
                                  :value="summary.E911Did"/>
                <WizardSummaryRow :label="`${$t('accountForm.general.label.SMSCallerID')}:`"
                                  :value="summary.SMSDid"/>
                <WizardSummaryRow :label="`${$t('accountForm.general.label.dialAuthenticationType')}:`"
                                  :value="summary.dialAuthenticationType"/>
            </template>

            <!-- <AccountWizardIdStep ref="idStep"
                                 :account-entity="accountEntity"
                                 :model-validations="modelValidations"
                                 :model="model"
                                 :summary="summary"/> -->
        </WizardStep>

        <WizardStep icon="vc-filter"
                    v-loading="loading"
                    :name="$t('account.wizard.finalStep')"
                    :title="$t('account.wizard.finalStep')"
                    :before-leave="validateFinalStep"
                    class="flex items-center">

            <template v-slot:summary>
                <WizardSummaryRow :label="`${$t('accountForm.general.label.accountPhone')}:`"
                                  :value="model.AccountPhone"/>
                <WizardSummaryRow :label="`${$t('accountForm.general.label.accountFax')}:`"
                                  :value="model.AccountFax"/>
                <WizardSummaryRow :label="`${$t('accountForm.general.label.accountEmail')}:`"
                                  :value="model.AccountEmail"/>
                <WizardSummaryRow :label="`${$t('accountForm.general.label.accountDescription')}:`"
                                  :value="model.AccountDescription"/>
            </template>

            <!-- <AccountWizardFinalStep ref="finalStep"
                                    :model-validations="modelValidations"
                                    :model="model"
                                    :name="nameInitials"
                                    @color-change="(value) => avatarColor = value"
                                    :summary="summary"/> -->
        </WizardStep>

    </Wizard>
</template>

<script>
    // import get from 'lodash/get'
    import Wizard from '@/modules/reports/components/newWizard/Wizard/Wizard';
    import WizardStep from '@/modules/reports/components/newWizard/Wizard/WizardStep';
    import WizardSummaryRow from '@/modules/reports/components/newWizard/Wizard/WizardSummaryRow';
    // import AccountWizardGeneralStep from './AccountWizardGeneralStep'
    // import AccountWizardIdStep from './AccountWizardIdStep'
    // import AccountWizardFinalStep from './AccountWizardFinalStep';
    // import {generateDefaultAvatar} from 'src/api/apiCalls'

    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            }
        },
        components: {
            // AccountWizardFinalStep,
            Wizard,
            WizardStep,
            WizardSummaryRow,
            // AccountWizardGeneralStep,
            // AccountWizardIdStep
        },
        data() {
            return {
                model: {
                    AvatarID: '',
                    AccountName: '',
                    AccountStatus: 1,
                    ParentAccount: '',
                    AccountDescription: '',
                    AccountLanguage: null,
                    MainDID: '',
                    E911DidId: null,
                    SMSDidId: null,
                    DialAuthenticationType: '',
                    AccountTimeZoneId: null,
                    AccountPhone: '',
                    AccountEmail: '',
                    AccountFax: '',
                },
                avatarColor: '',
                confData: {},
                summary: {
                    parentAccount: '',
                    dialAuthenticationType: '',
                    timezone: '',
                    language: '',
                    MainDID: '',
                    E911Did: '',
                    SMSDid: ''
                },
                modelValidations: {
                    required: {
                        required: true
                    },
                    number: {
                        numeric: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    phone: {
                        phoneNumber: true,
                        required: true,
                        numeric: true,
                    },
                },
                validationLoading: false
            }
        },
        computed: {
            nameInitials() {
                if (this.model.AccountName === '') {
                    return ''
                }
                let name = this.model.AccountName.split(' ')
                let firstName = name[0] ? name[0].charAt(0).toUpperCase() : ''
                let lastName = name[1] ? name[1].charAt(0).toUpperCase() : ''
                return firstName + lastName
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
            async refresh() {
                this.resetModel();
                this.resetSummary();

                if (this.$refs.wizard) {
                    this.$refs.wizard.reset(0)
                }

                await this.$validator.reset()
            },
            resetModel() {
                this.$set(this, 'model', {
                    AccountName: '',
                    AccountStatus: 1,
                    ParentAccount: '',
                    AccountDescription: '',
                    AccountLanguage: null,
                    MainDID: '',
                    E911DidId: null,
                    SMSDidId: null,
                    DialAuthenticationType: '',
                    AccountTimeZoneId: null,
                    AccountPhone: '',
                    AccountEmail: '',
                    AccountFax: ''
                });
            },
            resetSummary() {
                this.$set(this, 'summary', {
                    parentAccount: '',
                    dialAuthenticationType: '',
                    timezone: '',
                    language: '',
                    MainDID: '',
                    E911Did: '',
                    SMSDid: ''
                })
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
                const params = {
                    title: this.$t('general.cancelConfirmation'),
                    message: this.$t('general.cancelConfirmationText'),
                    type: 'confirm-cancel'
                };

                const result = await this.$confirmModal(params);

                if (!result) {
                    return
                }
                await this.refresh();
                this.$emit('cancel');
            }
        },
        // created() {
        //     this.$set(this, 'confData', this.getLoginStatusParameters() || {})
        // }
    }
</script>
