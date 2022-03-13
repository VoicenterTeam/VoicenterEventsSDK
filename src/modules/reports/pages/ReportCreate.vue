<template>
    <div class="report-create">
        <div class="report-create--title">
            {{ $t('report.create.title') }}
        </div>
        <div class="report-create-container">
            <div class="report-create-container--steps">
                {{ getActiveStep }}
            </div>
            <div class="report-create-container--body">
                <component
                    :is="getStepComponent"
                    :key="currentStep"
                    @on-update-step-number="onUpdateStepData"
                    @on-back="onBack"
                />
            </div>
            <div class="report-create-container--actions">
                <div
                    class="border-t-2 px-16 border-gray-300 bottom-0 h-20 flex w-full items-center justify-between"
                >
                    <portal-target name="prev-button">
                        <base-button
                            outline
                            fixed-width="w-37"
                            @click="onCancel"
                        >
                            <div class="flex items-center">
                                <IconDiscard class="mx-1"/>
                                <span class="mx-1 text-base font-bold">{{ $t('common.cancel') }}</span>
                            </div>
                        </base-button>
                    </portal-target>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const wizardLength = 3

export default {
    name: "report-create",
    components: {
        CreateReportStep0: () => import('@/modules/reports/components/create-report/CreateReportStep0.vue'),
        CreateReportStep1: () => import('@/modules/reports/components/create-report/CreateReportStep1.vue'),
        CreateReportStep2: () => import('@/modules/reports/components/create-report/CreateReportStep2.vue')
    },
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            currentStep: 0
        }
    },
    computed: {
        getStepComponent() {
            return `CreateReportStep${this.currentStep}`
        },
        getActiveStep() {
            return this.$t('general.step') + ' ' + (this.currentStep + 1) + ' ' + this.$t('general.of') + ' ' + wizardLength
        }
    },
    methods: {
        onCancel() {
            this.$emit('on-close-create-report-tab')
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
        }
    },
    async beforeDestroy() {
        await this.$store.dispatch('report/resetReportData')
    }
}
</script>

<style lang="scss" scoped>
.report-create {
    @apply mt-10 ml-9;
    &--title {
        @apply font-medium text-2xl;
    }
    &-container {
        @apply bg-white shadow-base mb-3 mt-7 mr-3 rounded-lg;
        &--steps {
            @apply pt-7 text-sm px-16;
        }
        &--body {
            height: 495px;
            @apply px-16;
        }
        &--actions {

        }
    }
}
</style>
