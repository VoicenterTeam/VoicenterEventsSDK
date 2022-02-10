<template>
    <div class="edit-report"
         v-loading="loading"
    >
        <ReportForm v-if="report"
                    :report="report"
                    @on-update="onUpdateReport"
                    v-on="$listeners"/>
    </div>
</template>
<script>
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
                const { ReportName, ReportID} = this.report
                this.$emit('on-update-tabs', ReportName, ReportID)
            },
            async onUpdateReport(data = {}) {
                console.log({data})
                this.report = {
                    ...this.report,
                    ...data
                }
                //await this.$store.dispatch('report/setReport', this.report)
            },
        },
        mounted() {
            console.log('MOUNTED')
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
