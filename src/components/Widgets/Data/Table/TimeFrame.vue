<template>
    <div class="text-main-2xl font-semibold">
        {{getDateInterval}}
    </div>
</template>
<script>
    import get from 'lodash/get'
    import format from 'date-fns/format'

    export default {
        props: {
            widget: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            getDateInterval () {
                let start = new Date()
                let end = new Date()

                const startDate = get(this.widget, 'WidgetTime.datedeff', 1)
                const dateInterval = get(this.widget, 'WidgetTime.Date_interval', 1)

                start.setDate(start.getDate() - startDate)
                end.setDate(end.getDate() - (startDate - dateInterval))

                return `${format(start, 'MM/dd/yyyy')}  -  ${format(end, 'MM/dd/yyyy')}`
            }
        }
    }
</script>
