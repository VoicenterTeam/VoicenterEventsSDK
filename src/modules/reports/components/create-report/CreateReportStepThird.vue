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
    }
}
</script>