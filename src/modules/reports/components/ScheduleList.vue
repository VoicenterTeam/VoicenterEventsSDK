<template>
    <div class="mt-18">
        <div class="flex items-center justify-between pb-5">
            <div class="text-lg font-medium">{{ $t('widget.scheduleList') }}</div>
            <div>
                Add new schedule
            </div>
        </div>
        <div class="border-l-5 p-4 border-primary">
            <div class="">
                <schedule-card
                    class="schedule-card-item"
                    v-for="(trigger, index) in qwe"
                    :trigger-name="trigger.ReportTriggerName"
                    :trigger-id="trigger.ReportTriggerID"
                    :key="index"
                    :conditions="trigger.ReportTriggerCondition"
                    :recipients="trigger.ReportRecipient"
                    actionsWithSchedule
                 />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
        ScheduleCard: () => import('@/modules/reports/components/ScheduleCard')
    },
    data () {
        return {
            qwe: [
                { "ReportID": 255, "EmailBody": "I am a {{ReportName}} from a {{ReportTriggerName}}", "EmailSubject": "Hello, here is your report: {{ReportName}}", "ScheduleData": { "TriggerTime": "00:15", "TriggerDayOfWeek": [ 1 ] }, "LastCheckTime": "2022-03-11 09:34:31.000000", "NextCheckTime": "2022-03-11 09:34:31.000000", "ReportRecipient": [ { "Email": "", "ReportID": 255, "RecipientID": 640, "ReportTriggerID": 737, "ReportRecipientID": 4091, "ReportRecipientTypeID": 2, "ReportRecipientStatusID": 1, "ReportRecipientTypeName": "Account", "ReportRecipientStatusName": "sended" } ], "ReportTriggerID": 737, "ReportTriggerName": "Special", "ReportTriggerTypeID": 2, "ReportTriggerStatusID": 1, "ReportTriggerTypeName": "Daily", "ReportTriggerCondition": [], "ReportTriggerStatusName": "enable" },
                { "ReportID": 255, "EmailBody": "I am a {{ReportName}} from a {{ReportTriggerName}}", "EmailSubject": "Hello, here is your report: {{ReportName}}", "ScheduleData": { "TriggerTime": "00:15", "TriggerDayOfWeek": [ 1 ] }, "LastCheckTime": "2022-03-11 09:34:31.000000", "NextCheckTime": "2022-03-11 09:34:31.000000", "ReportRecipient": [ { "Email": "", "ReportID": 255, "RecipientID": 640, "ReportTriggerID": 737, "ReportRecipientID": 4091, "ReportRecipientTypeID": 2, "ReportRecipientStatusID": 1, "ReportRecipientTypeName": "Account", "ReportRecipientStatusName": "sended" } ], "ReportTriggerID": 737, "ReportTriggerName": "Special", "ReportTriggerTypeID": 2, "ReportTriggerStatusID": 1, "ReportTriggerTypeName": "Daily", "ReportTriggerCondition": [], "ReportTriggerStatusName": "enable" }
            ]
        }
    } 
}
</script>

<style lang="scss" scoped>
.schedule-card-item:not(:last-child) {
    @apply mb-3;
}
</style>