<template>
    <div class="h-full w-full">
        <div>
            <schedule-list />
        </div>
    </div>
</template>

<script>

export default {
    components: {
        ScheduleList: () => import('@/modules/reports/components/ScheduleList.vue')
    },
    computed: {
        getReportData () {
            return this.$store.getters['report/getReportData']
        }
    },
    methods: {
        validate () {
            return this.getReportData.ReportTriggerList.length
        }
    }
}
</script>