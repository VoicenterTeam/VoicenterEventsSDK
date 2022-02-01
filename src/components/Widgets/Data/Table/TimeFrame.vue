<template>
    <div :style="getStyles"
         class="text-main-2xl flex items-center font-semibold truncate">
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
            return this.$store.getters['layout/widgetTitleStyles']('activeLayout')
        },
        getDateInterval() {
            return timeFilterToHuman(this.widget)
        },
    },
}
</script>
