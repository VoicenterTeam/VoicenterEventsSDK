<template>
    <div>
        <div class="cursor-pointer text-primary-300 hover:text-primary"
             @click="showDialog = true">
            <div class="flex items-center">
                <IconAddReport class="w-4 h-4 mx-1"/>
                <span class="text-main-sm leading-4">
                    {{ $t('Add New Schedule') }}
                </span>
            </div>
        </div>
        <modal v-show="showDialog"
               :visible.sync="showDialog"
               width="90%"
               top="5vh"
               wrapper-classes="full-height"
        >
            <template v-slot:title>
                <div class="flex w-full justify-center">
                    {{ $t('Add Schedule') }}
                </div>
            </template>
            <div class="grid grid-cols-8 relative">
                <div class="col-span-6">
                    <div class="flex w-full text-sm leading-5 p-8">
                        {{ getActiveStep }}
                    </div>
                    <fade-transition :duration="250"
                                     mode="out-in">
                        <component :is="getStepComponent"
                                   :key="currentStep"
                                   v-bind="$attrs"
                                   @on-update="onUpdateStepData"
                                   class="step-wrapper px-16"/>
                    </fade-transition>
                    <div
                        class="col-span-6 border-t-2 px-16 border-gray-300 bottom-0 h-20 flex w-full items-center justify-between">
                        <base-button class="mx-4"
                                     @click="onCancel"
                                     variant="discard"
                                     fixed-width="w-37">
                            <div class="flex items-center">
                                <IconDiscard class="mx-1"/>
                                <span class="mx-1 text-base font-bold">{{ 'Cancel' }}</span>
                            </div>
                        </base-button>
                        <div class="flex items-center">
                            <div @click="onBack"
                                 v-if="canGoBack"
                                 class="text-primary-300 flex items-center hover:text-primary cursor-pointer mx-16">
                                <IconDirLeft/>
                                <span class="mx-1">{{ $t('Back') }}</span>
                            </div>
                            <portal-target name="next-button">
                                <base-button fixed-width="w-37"
                                             @click="onNext">
                                    <div class="flex items-center">
                                        <span class="mx-1 text-base font-bold">{{ $t('Next') }}</span>
                                        <IconDirRight class="mx-1"/>
                                    </div>
                                </base-button>
                            </portal-target>
                            <portal-target name="additional-actions"/>
                        </div>
                    </div>
                </div>
                <div class="col-span-2 bg-gray-light p-6">
                    <Wizard :wizard-data="wizardData"
                            v-if="drawWizard"
                            @on-edit-step="onEditStep"
                            :current-step="currentStep"
                    />
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
    import Modal from '@/components/Common/Modal'
    import Wizard from '@/modules/reports/components/wizard/Wizard'
    import Step0 from '@/modules/reports/components/schedule/components/Step0'
    import Step1 from '@/modules/reports/components/schedule/components/Step1'
    import WizardSummary from '@/modules/reports/components/wizard/components/wizard-summary'

    const WIZARD_CONFIG = [
        {
            icon: 'IconCondition',
            name: 'Date and Conditions',
            isActive: true,
            summary: '',
            canEdit: false,
        },
        {
            icon: 'IconEmailGroup',
            name: 'Message Settings',
            isActive: false,
            summary: '',
            canEdit: false,
            isLast: true,
        },
    ]

    export default {
        components: {
            Modal,
            Step0,
            Step1,
            Wizard,
        },
        data() {
            return {
                showDialog: false,
                currentStep: 0,
                drawWizard: true,
                wizardData: new WizardSummary(WIZARD_CONFIG),
            }
        },
        computed: {
            getStepComponent() {
                return `Step${this.currentStep}`
            },
            canGoBack() {
                return this.currentStep > 0
            },
            getActiveStep() {
                return this.$t('Step') + ' ' + (this.currentStep+1) + ' ' + this.$t('of') + ' ' + WIZARD_CONFIG.length
            },
        },
        methods: {
            onCancel() {
                this.showDialog = false
            },
            onNext() {
                this.currentStep++
            },
            onBack() {
                this.currentStep--
            },
            onUpdateStepData(data = {}) {
                const { summary: summary, nextStep: nextStep = false } = data
                this.wizardData.updateStepSummary(this.currentStep, summary)
                if (nextStep) {
                    this.onNext()
                }
            },
            onEditStep(stepIndex) {
                this.currentStep = stepIndex
            },
            onSubmit() {
                console.log('onSubmit')
            },
        },
    }
</script>
<style lang="scss">
.grid-wrapper {
    @apply bg-white shadow-base rounded-md;
}

.step-wrapper {
    max-height: 65vh;
}

.content-wrapper {
    min-height: 65vh;
    max-height: 65vh;
    @apply overflow-auto;
}

.transition {
    transition: all 0.3s ease-out;
}
</style>
