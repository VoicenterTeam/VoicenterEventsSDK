<template>
    <div class="edit-report"
         v-loading="loading"
    >
        <ReportForm v-if="report"
                    :report="report"
                    v-on="$listeners"/>
    </div>
</template>
<script>
    import { reportApi } from '@/modules/reports/services/reportService'
    import ReportForm from '@/modules/reports/components/report-form/ReportForm'
    
    export default {
        components: {
            ReportForm,
        },
        data() {
            return {
                report: null,
                loading: false,
            }
        },
        computed: {
            reportToEdit() {
                return this.$store.getters['report/getReportData']
            },
        },
        methods: {
            getReport() {
                this.report = {
                    ...this.reportToEdit,
                }
                const { ReportName } = this.report
                this.$emit('on-update-tabs', ReportName)
            },
        },
        mounted() {
            if (!this.reportToEdit) {
                this.$notify({
                    type: 'danger',
                    icon: true,
                    title: 'Not Found',
                    message: 'Invalid id or report are deleted',
                })
                return this.$router.push('/reports')
            }
            this.getReport()
        },
    }
</script>
<style lang="scss">
.edit-report {
    .el-loading-mask {
        position: fixed !important;
        top: 0%;
    }
}
</style>
