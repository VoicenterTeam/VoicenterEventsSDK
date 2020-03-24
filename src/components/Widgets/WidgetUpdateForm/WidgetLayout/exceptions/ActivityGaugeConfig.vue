<template>
    <div>
        <label>{{$t('queue.activity.to.display')}}</label>
        <base-select
            v-model="model.WidgetLayout.ShowActivities"
            :data="activitiesToDisplay"/>
    </div>
</template>
<script>
    import {activitiesToDisplay} from '@/enum/queueDashboardStatistics'

    export default {
        component: {},
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                activitiesToDisplay
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
