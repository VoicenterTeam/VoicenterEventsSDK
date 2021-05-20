<template>
    <ReportForm v-on="$listeners"/>
</template>
<script>
    import ReportForm from '@/modules/reports/components/report-form/ReportForm'
    
    export default {
        components: {
            ReportForm,
        },
    }
</script>
