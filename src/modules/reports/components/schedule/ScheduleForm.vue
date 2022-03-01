<template>
    <div class="schedule-form">
        <div class="cursor-pointer text-primary-300 hover:text-primary"
             @click="showDialog = true">
            <div class="flex items-center">
                <IconAddReport class="w-4 h-4 mx-1"/>
                <span class="text-main-sm leading-4">
                    {{ $t('widget.addNewSchedule') }}
                </span>
            </div>
        </div>
        <modal
            v-show="showDialog"
            :visible.sync="showDialog"
            width="90%"
            top="5vh"
            wrapper-classes="full-height"
        >
            <template v-slot:title>
                <div class="flex w-full justify-center">
                    {{ $t('widget.addSchedule') }}
                </div>
            </template>
            <div class="relative">
                <div class="" v-if="showDialog">
                    <div class="flex w-full text-sm leading-5 p-8">
                        {{ getActiveStep }}
                    </div>
                    <fade-transition
                        :duration="250"
                        mode="out-in">
                        <component
                            :is="getStepComponent"
                            :key="currentStep"
                            v-bind="$attrs"
                            @on-update="onUpdateStepData"
                            :reportItemData="data"
                            @on-back="onBack"
                            @on-finish="onFinish"
                            class="step-wrapper px-16"
                        />
                    </fade-transition>
                    <div
                        class="border-t-2 px-16 border-gray-300 bottom-0 h-20 flex w-full items-center justify-between">
                        <base-button class="mx-4"
                                     outline
                                     fixed-width="w-37"
                                     @click="onCancel">
                            <div class="flex items-center">
                                <IconDiscard class="mx-1"/>
                                <span class="mx-1 text-base font-bold">{{ 'Cancel' }}</span>
                            </div>
                        </base-button>
                        <div class="flex items-center">
                            <portal-target name="next-button">
                                <base-button
                                    fixed-width="w-37"
                                    type="primary"
                                    @click="onNext"
                                >
                                    <div class="flex items-center">
                                        <span class="mx-1 text-base font-bold">{{ $t('general.next') }}</span>
                                        <IconDirRight class="mx-1"/>
                                    </div>
                                </base-button>
                            </portal-target>
                            <portal-target name="additional-actions"/>
                        </div>
                    </div>
                </div>
                <!-- <div class="col-span-2 bg-gray-light p-6">
                    <Wizard :wizard-data="wizardData"
                            v-if="drawWizard"
                            @on-edit-step="onEditStep"
                            :current-step="currentStep"
                    />
                </div> -->
            </div>
        </modal>
    </div>
</template>
<script>
    // import Wizard from './modules/reports/components/wizard/Wizard'
    // import WizardSummary from '@/modules/reports/components/wizard/components/wizard-summary'

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
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            Modal: () => import('@/components/Common/Modal'),
            Step0: () => import('@/modules/reports/components/schedule/components/Step0'),
            Step1: () => import('@/modules/reports/components/schedule/components/Step1')
        },
        data() {
            return {
                showDialog: false,
                currentStep: 0,
                drawWizard: true,
                wizardData: {}
            }
        },
        watch: {
            async showDialog (val) {
                if (!val) {
                    await this.$store.dispatch('report/resetReportData')
                    this.currentStep = 0
                }
            }
        },
        async mounted () {
            await this.$store.dispatch('report/resetReportData')
        },
        computed: {
            getStepComponent() {
                return `Step${this.currentStep}`
            },
            getActiveStep() {
                return this.$t('general.step') + ' ' + (this.currentStep+1) + ' ' + this.$t('general.of') + ' ' + WIZARD_CONFIG.length
            }
        },
        methods: {
            onCancel() {
                this.showDialog = false
            },
            onNext() {
                if (this.currentStep === 1) {
                    return
                }

                this.currentStep++
            },
            onBack() {
                this.currentStep--
            },
            onUpdateStepData(data = {}) {
                const { nextStep: nextStep = false } = data
                if (nextStep) {
                    this.onNext()
                }
            },
            onEditStep(stepIndex) {
                this.currentStep = stepIndex
            },
            onFinish () {
                this.showDialog = false
                this.$store.dispatch('report/resetReportData')
            }
        }
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
