<template>
    <div class="report-create">
        <create-report-wizard @on-cancel="onCancel" />
    </div>
</template>

<script>

export default {
    name: "report-create",
    components: {
        CreateReportWizard: () => import('@/modules/reports/components/create-report/CreateReportWizard.vue'),
    },
    methods: {
        onCancel() {
            this.$emit('on-close-create-report-tab')
        }
        // onNext() {
        //     if (this.currentStep === 2) {
        //         return
        //     }

        //     this.currentStep++
        // },
        // onBack() {
        //     if (this.currentStep === 0) {
        //         return
        //     }
        //     this.currentStep--
        // },
        // onUpdateStepData(data = {}) {
        //     const { nextStep: nextStep = false } = data

        //     if (nextStep) {
        //         this.onNext()
        //     }
        // },
        // onEditStep(stepIndex) {
        //     this.currentStep = stepIndex
        // }
    },
    async beforeDestroy() {
        await this.$store.dispatch('report/resetReportData')
    }
}
</script>

<style lang="scss" scoped>
.report-create {
    @apply mt-10;
    &--title {
        @apply font-medium text-2xl ml-14 mb-7;
    }
}
</style>
