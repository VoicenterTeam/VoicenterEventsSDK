<template>
    <div class="w-full bg-gray-200">
        Edit page
        <br>
        <ScheduleForm :data="report" />
        <button @click="setData" class="m-2">
            Set data for edit report Schedule
        </button>
    </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get"
import ScheduleForm from '@/modules/reports/components/schedule/ScheduleForm'

import { reportApi } from "../services/reportService"

export default {
    name: "report-edit",
    components: {
        ScheduleForm
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
        setData () {
            const data = cloneDeep(this.report.ReportTriggerList[60])
            // 47 50 60

            if ('TriggerTimeRange' in data.ScheduleData) {
                const timeRange = data.ScheduleData.TriggerTimeRange
                data.ScheduleData.TriggerTimeRange = [timeRange.Start, timeRange.End]
            }
            this.$store.dispatch('report/updateReportData', data)
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

        this.$store.dispatch('report/resetReportData')
    }
}
</script>
