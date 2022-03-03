<template>
    <ReportForm v-on="$listeners"/>
</template>
<script>
   
    export default {
        components: {
            ReportForm: () => import('@/modules/reports/components/report-form/ReportForm')
        },
    }
</script>
