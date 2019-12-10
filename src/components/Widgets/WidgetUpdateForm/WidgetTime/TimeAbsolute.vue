<template>
    <range-filter class="pt-2" :pickerOptions="pickerOptions" :date="fetchDate" @on-change="onChange"/>
</template>
<script>
    import {TIME_LINE_TIMESTAMP} from '@/enum/generic'
    import RangeFilter from '../../../Common/RangeFilter'

    export default {
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
            widgetTimeOptions: {
                type: Array,
                default: () => []
            }
        },
        components: {
            RangeFilter
        },
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    },
                },
                date: []
            }
        },
        computed: {
            fetchDate() {
                let newDate = new Date()
                let widgetTime = this.model.WidgetTime

                let startDate = newDate.setDate(newDate.getDate() - widgetTime.datedeff);

                newDate = new Date();
                let endDate = newDate.setDate(newDate.getDate() + (-widgetTime.datedeff + widgetTime.Date_interval))

                return [startDate, endDate]
            }
        },
        methods: {
            onChange(dates) {
                let Difference_In_Time = new Date().getTime() - dates[0].getTime()
                this.model.WidgetTime.datedeff = parseInt(Difference_In_Time / TIME_LINE_TIMESTAMP.DAY)

                let _Difference_In_Time = dates[1].getTime() - dates[0].getTime()
                this.model.WidgetTime.Date_interval = parseInt(_Difference_In_Time / TIME_LINE_TIMESTAMP.DAY)
            }
        }
    }
</script>
