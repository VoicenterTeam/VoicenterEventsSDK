<template>
    <div>
        <ReportsTable @on-duplicate-report="tryDuplicateReport"
                      @on-add-report="onAddReport"
                      @on-delete-report="tryDeleteReport"
                      @on-edit-report="onEditReport"
        />
        <ConfirmDialog :visible.sync="showDeletePrompt"
                       @on-cancel="onCloseDialog"
                       @on-confirm="onDeleteReport"
                       @closed="onCloseDialog"
        >
            <template v-slot:title>
                <h3 class="w-full flex justify-center text-2xl font-semibold text-gray-700">
                    {{ $t('general.deleteConfirmation') }}
                </h3>
            </template>
            <div class="mt-10 mb-8 flex flex-col items-center justify-center">
                <IconQuestion/>
                <div class="text-center text-gray-900 text-sm leading-21 mt-5 max-w-65-p break-normal">
                    {{ this.$t('report.deleteReportConfirmation') }}
                </div>
                <br>
                <b>{{ reportToDelete.name }}</b>
            </div>
        </ConfirmDialog>
        <DuplicateReportDialog :visible.sync="showDuplicatePrompt"
                               @on-cancel="onCloseDialog"
                               :report="reportToDuplicate"
                               @on-confirm="onDuplicateReport"
                               @closed="onCloseDialog"
        />
    </div>
</template>
<script>
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import ReportsTable from '@/modules/reports/components/ReportsTable'
    import DuplicateReportDialog from '@/modules/reports/components/report-form/DuplicateReportDialog'
    import { reportApi } from '@/modules/reports/services/reportService'
    
    export default {
        components: {
            ReportsTable,
            ConfirmDialog,
            DuplicateReportDialog,
        },
        data() {
            return {
                showDeletePrompt: false,
                reportToDelete: {},
                reportToDuplicate: {},
                showDuplicatePrompt: false,
            }
        },
        methods: {
            tryDuplicateReport(report) {
                this.showDuplicatePrompt = true
                this.reportToDuplicate = report
            },
            async onEditReport(report) {
                console.log('LIST onEditReport', report)
                await this.storeReport(report)
                this.$emit('on-update-tabs', report.ReportName, report.ReportID)
                const editUrl = `/reports/edit/${report.ReportID}`
                if(this.$route.path === editUrl) return
                await this.$router.push(editUrl)
            },
            async storeReport(report) {
                await this.$store.dispatch('report/setReport', report)
            },
            onAddReport() {
                this.$router.push('/reports/create')
            },
            tryDeleteReport(report) {
                this.reportToDelete = report
                this.showDeletePrompt = true
            },
            onCloseDialog() {
                this.showDeletePrompt = false
                this.showDuplicatePrompt = false
                this.reportToDelete = {}
                this.reportToDuplicate = {}
            },
            async onDuplicateReport(data = {}) {
                try {
                    this.onCloseDialog()
                    this.loading = true
                    let { model: newReport, report: report } = data
                    newReport = {
                        ...report,
                        ...newReport,
                        AccountID: 1
                    }
                    await reportApi.store(newReport)
                    await this.$store.dispatch('report/getReports')
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                }
            },
            onDeleteReport() {
                this.onCloseDialog()
            },
        },
        mounted() {
            this.$store.dispatch('report/setReport', null)
        },
    }
</script>
