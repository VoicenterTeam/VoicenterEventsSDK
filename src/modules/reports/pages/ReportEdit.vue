<template>
    <div class="w-full bg-gray-200">
        Edit page
        <br>
        <!-- <div v-if="report">qwf</div> -->
        <ScheduleForm :data="report" />
    </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get"

import { reportApi } from "../services/reportService"

export default {
    name: "report-edit",
    components: {
        ScheduleForm: () => import('@/modules/reports/components/schedule/ScheduleForm')
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
