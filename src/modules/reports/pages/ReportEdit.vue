<template>
    <div class="w-full bg-gray-200">
        <edit-report-page
            v-if="report && Object.keys(report).length"
            :report="report"
            :reportId="reportId"
            @on-cancel="onCancel"
            @on-reload-data-reports-list="onReloadDataReportsList"
            @update-report-item="updateReportItem"
        />
    </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get"

import { reportApi } from "../services/reportService"

export default {
    name: "report-edit",
    components: {
        EditReportPage: () => import('@/modules/reports/components/edit-report/EditReportPage.vue')
    },
    props: {
        data: {
            type: Object,
            default: null
        },
        reportId: {
            type: [Number, String],
            default: ''
        }
    },
    data() {
        return {
            report: {}
        }
    },
    methods: {
        onCancel() {
            this.$emit('on-close-create-report-tab')
        },
        onReloadDataReportsList () {
            this.$emit('on-reload-data-reports-list')
        },
        updateReportItem (data) {
            this.$emit('update-report-item', data)
        }
    },
    async mounted() {
        if (this.data) {
            this.report = cloneDeep(this.data)
        } else {
            const data = await reportApi.info(this.reportId)
            this.report = cloneDeep(data)

            const reportName = get(data, 'ReportName', '')
            this.$emit('update-title', this.reportId, reportName)
        }
    }
}
</script>

<style lang="scss" scoped>
.report-edit {
    &-title {
        @apply mt-11;
    }
}
</style>