<template>
    <div class="schedule-form">
        <div class="cursor-pointer text-primary-300 hover:text-primary"
             @click="showDialog = true">
            <div class="flex items-center">
                <i class="icon-lg text-primary" :class="icon" />
                <span class="text-main-sm leading-4">
                    {{ buttonLabel }}
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
                            :reportId="reportId"
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
            </div>
        </modal>
    </div>
</template>
<script>
    export default {
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            buttonLabel: {
                type: String,
                default: 'Add Schedule'
            },
            icon: {
                type: String,
                default: false
            },
            reportId: {
                type: Number
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
        computed: {
            getStepComponent() {
                return `Step${this.currentStep}`
            },
            getActiveStep() {
                return this.$t('general.step') + ' ' + (this.currentStep + 1)
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
                if (this.currentStep === 0) {
                    return
                }
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
