<template>
    <div>
        <div class="flex items-center justify-between pb-4">
            <span class="leading-6 font-medium text-xl">
                {{$t('Schedule list')}}
            </span>
            <ScheduleForm v-bind="$attrs"/>
        </div>
        <div class="schedule-list overflow-hidden py-4 px-6">
            <ScheduleCard v-for="(schedule, index) in mockSchedules"
                          :schedule="schedule"
                          :key="index"
                          :class="{'mb-4': mockSchedules.length - 1 !== index}"
            />
        </div>
    </div>
</template>
<script>
    import ScheduleCard from '@/modules/reports/components/report-form/ScheduleCard'
    import ScheduleForm from '@/modules/reports/components/report-form/ScheduleForm'
    
    export default {
        components: {
            ScheduleCard,
            ScheduleForm,
        },
        props: {
            type: Object,
            default: () => ({}),
        },
        data() {
            return {
                mockSchedules: [
                    {
                        name: 'Schedule config 1',
                        time: {
                            frequency: 'Daily',
                            days: ['We', 'Th', 'Fr'],
                        },
                        conditions: ['If (  WaitTime  >  0  and  AvailableAgents  >  7  )  or  (  WaitTime  >  0  and  AvailableAgents  >  7  )'],
                        recipients: ['test@test.com', 'test1@test.com'],
                    },
                    {
                        name: 'Schedule config 2',
                        time: {
                            frequency: 'Monthly',
                            days: ['Su', 'Mo', 'Sa'],
                        },
                        conditions: [],
                        recipients: ['cp@test.com', 'cp1@test.com'],
                    },
                ],
            }
        },
    }
</script>
<style lang="scss">
    .schedule-list {
        @apply bg-gray-150 border border-gray-550 rounded-md box-border;
    }
</style>
