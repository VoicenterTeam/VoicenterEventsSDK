<template>
    <div class="text-main-2xl flex items-center font-semibold" :style="$store.getters['dashboards/widgetTitleStyles']">
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

                const startDate = get(this.widget, 'WidgetTime.Date_interval', 0)
                const dateInterval = get(this.widget, 'WidgetTime.datedeff', 0)

                start.setDate(start.getDate() - startDate)
                end.setDate(end.getDate() - (startDate - dateInterval))

                return `${format(start, 'dd/MM/yyyy')}  -  ${format(end, 'dd/MM/yyyy')}`
            }
        }
    }
</script>
