<template>
    <div class="mt-18">
        <div class="flex items-center justify-between pb-5">
            <div class="text-lg font-medium">{{ $t('widget.scheduleList') }}</div>
            <div>
                Add new schedule
            </div>
        </div>
        <div class="border-l-5 p-4 border-primary">
            <div class="grid grid-cols-2 gap-4">
                <!-- <schedule-card
                    v-for="(trigger, index) in row.ReportTriggerList"
                    :trigger-name="trigger.ReportTriggerName"
                    :key="index"
                    :conditions="trigger.ReportTriggerCondition"
                    :recipients="trigger.ReportRecipient">
                </schedule-card> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {

    } 
}
</script>

<style lang="scss" scoped>

</style>