<template>
    <div class="schedule-form">
        <div class="cursor-pointer text-primary-300 hover:text-primary"
             @click="openModal">
            <div class="flex items-center">
                <i class="icon-base text-primary add-schedule-btn-text" :class="icon" />
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
                <div class="flex w-full justify-center text-xl">
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
                </div>
            </div>
            <template #footer>
                <div
                    class="border-t-2 px-16 border-gray-300 bottom-0 h-20 flex w-full items-center justify-between">
                    <base-button
                        class="mx-4"
                        outline
                        fixed-width="w-37"
                        @click="onCancel"
                    >
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="mx-1 text-base font-bold">{{ $t('common.cancel') }}</span>
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
            </template>
        </modal>
    </div>
</template>
<script>
    const wizardLength = 3
    import { Notification } from 'element-ui'
    import cloneDeep from 'lodash/cloneDeep'

    export default {
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            buttonLabel: {
                type: String,
                default: ''
            },
            icon: {
                type: String,
                default: false
            },
            reportId: {
                type: Number
            },
            dataToEdit: {
                type: Object,
                default: () => ({})
            }
        },
        provide () {
            return {
                dataToEdit: this.dataToEdit
            }
        },
        components: {
            Modal: () => import('@/components/Common/Modal'),
            Step0: () => import('@/modules/reports/components/schedule/components/Step0'),
            Step1: () => import('@/modules/reports/components/schedule/components/Step1'),
            Step2: () => import('@/modules/reports/components/schedule/components/Step2')
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
                    await this.$store.dispatch('reportTrigger/resetReportTriggerData')
                    this.currentStep = 0
                }
            }
        },
        computed: {
            getStepComponent() {
                return `Step${this.currentStep}`
            },
            getActiveStep() {
                return this.$t('general.step') + ' ' + (this.currentStep + 1) + ' ' + this.$t('general.of') + ' ' + wizardLength
            }
        },
        methods: {
            onCancel() {
                this.showDialog = false
            },
            onNext() {
                if (this.currentStep === 2) {
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
                this.$store.dispatch('reportTrigger/resetReportTriggerData')
                this.$emit('addedSchedule')
            },
            async openModal () {
                if (!this.data || !this.data.ReportItemList.length) {
                    Notification.warning(this.$t('report.schedule.needAddAtLeastOneWidget'))
                    return
                }
                this.showDialog = true
                const { reportTriggerData } = this.dataToEdit
                if (this.dataToEdit && Object.keys(this.dataToEdit).length) {
                    const isReportDoesNotHaveTriggerCondition = reportTriggerData.ReportTriggerCondition.every(el => !Object.keys(el).length)
                    reportTriggerData.ReportTriggerCondition = reportTriggerData.ReportTriggerCondition
                        .filter(el => {
                            if (el && el.ReportTriggerConditionFilter && el.ReportTriggerConditionFilter.length) {
                                el.ReportTriggerConditionFilter = el.ReportTriggerConditionFilter.filter(el => Object.values(el).every(el => el !== '' && el !== null))
                            }
                            return el && Object.keys(el).length
                        })
                    await this.$store.dispatch('reportTrigger/updateReportTriggerData', cloneDeep(reportTriggerData))
                    if (isReportDoesNotHaveTriggerCondition) {
                        await this.$store.dispatch('reportTrigger/updateReportTriggerCondition')
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
.grid-wrapper {
    @apply bg-white shadow-base rounded-md;
}

.step-wrapper {
    height: 100%;
    min-height: calc(95vh - 280px);
    max-height: calc(95vh - 280px);
    @apply overflow-auto;
}

.transition {
    transition: all 0.3s ease-out;
}

[dir="rtl"] .add-schedule-btn-text {
    @apply ml-2;
}
[dir="ltr"] .add-schedule-btn-text {
    @apply mr-2;
}
</style>
