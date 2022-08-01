<template>
    <div class="report-create">
        <create-report-wizard @go-back="goBack" />
    </div>
</template>

<script>

export default {
    name: "report-create",
    components: {
        CreateReportWizard: () => import('@/modules/reports/components/create-report/CreateReportWizard.vue'),
    },
    methods: {
        goBack() {
            this.$emit('on-close-create-report-tab')
        }
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
