<template>
    <div :style="getStyles"
         class="text-main-2xl text-gray-700 flex items-center font-semibold truncate">
        {{ getDateInterval }}
    </div>
</template>
<script>
import { timeFilterToHuman } from '@/helpers/widgetUtils'

export default {
    props: {
        widget: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        getStyles() {
            return this.$store.getters['layout/widgetTitleStyles']
        },
        getDateInterval() {
            return timeFilterToHuman(this.widget, 'dd.MM.yyyy')
        },
    },
}
</script>
