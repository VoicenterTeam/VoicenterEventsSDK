<template>
    <div class="mt-18">
        <div class="flex items-center justify-between pb-5">
            <div class="text-lg font-medium">{{ $t('widget.scheduleList') }}</div>
            <div>
                <schedule-form
                    buttonLabel="Add New Schedule"
                    icon="vc-icon-add"
                    :reportId="null"
                    @addedSchedule="addedSchedule"
                    :data="copyOfGetReportData"
                    :title="$t('widget.addSchedule')"
                />
            </div>
        </div>
        <div
            id="schedule-card"
            v-if="getReportData.ReportTriggerList.length"
            class="border-l-5 p-4 border-primary schedule-card-container"
        >
            <schedule-card
                class="schedule-card-item"
                v-for="(trigger, index) in getReportData.ReportTriggerList"
                :trigger-name="trigger.ReportTriggerName"
                :trigger-id="trigger.ReportTriggerID"
                :key="index"
                :conditions="trigger.ReportTriggerCondition"
                :recipients="trigger.ReportRecipient"
                actionsWithSchedule
                :index="index"
            />
        </div>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
    components: {
        ScheduleCard: () => import('@/modules/reports/components/ScheduleCard'),
        ScheduleForm: () => import('@/modules/reports/components/schedule/ScheduleForm.vue')
    },
    computed: {
        getReportData () {
            return this.$store.getters['report/getReportData']
        },
        copyOfGetReportData () {
            return cloneDeep(this.getReportData)
        }
    },
    methods: {
        addedSchedule () {
            this.$nextTick(() => {
                const element = document.getElementById('schedule-card')
                if (element) {
                    element.scrollTo({
                        top: element.scrollHeight,
                        behavior: 'smooth'
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.schedule-card-item:not(:last-child) {
    @apply mb-3;
}
.schedule-card-container {
    height: 100%;
    min-height: 350px;
    max-height: 350px;
    overflow-y: auto;

    border: 1px solid #BEC2C9;
    border-radius: 6px;
    @apply bg-gray-150;
}
</style>