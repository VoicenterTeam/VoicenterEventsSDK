<template>
    <date-time-picker
        class="pt-2"
        :pickerOptions="pickerOptions"
        :date="fetchDate"
        @on-change="onChange"
        :rangeSeparator="rangeSeparator"
    />
</template>
<script>
    import {TIME_LINE_TIMESTAMP} from '@/enum/generic'
    import {format} from 'date-fns'
    import get from 'lodash/get'

    export default {
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
            widgetTimeOptions: {
                type: Array,
                default: () => []
            },
            rangeSeparator: {
                type: String
            }
        },
        components: {
            DateTimePicker: () => import('../../../Common/DateTimePicker')
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

                let startDate = newDate.setDate(newDate.getDate() - parseInt(widgetTime.Date_interval));

                newDate = new Date();
                let endDate = newDate.setDate(newDate.getDate() + (-parseInt(widgetTime.Date_interval) + parseInt(widgetTime.datedeff)))

                return [startDate, endDate]
            }
        },
        methods: {
            onChange(dates) {
                const dateStart = get(dates, '[0]')
                const dateEnd = get(dates, '[1]')

                let Difference_In_Time = dateEnd.getTime() - dateStart.getTime()

                this.model.WidgetTime.datedeff = parseInt(Difference_In_Time / TIME_LINE_TIMESTAMP.DAY).toString()

                let _Difference_In_Time = new Date().getTime() - dateStart.getTime()
                this.model.WidgetTime.Date_interval = parseInt(_Difference_In_Time / TIME_LINE_TIMESTAMP.DAY).toString()

                this.model.WidgetTime['Date_start'] = format(new Date(dateStart), 'yyyy-MM-dd')
                this.model.WidgetTime['Date_end'] =format(new Date(dateEnd), 'yyyy-MM-dd')
            }
        }
    }
</script>
