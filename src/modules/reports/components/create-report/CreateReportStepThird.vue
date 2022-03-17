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
    methods: {
        goNext () {
            this.$emit('on-update-step-number', { nextStep: true })
        },
        onFinish () {
            console.log('on finish')
        },
        onBack () {
            this.$emit('on-back')
        }
    }
}
</script>