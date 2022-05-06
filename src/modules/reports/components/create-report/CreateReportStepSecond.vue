<template>
    <div class="h-full w-full">
        <wrapper-widget-table ref="widgetTable" />
    </div>
</template>

<script>
import WrapperWidgetTable from '@/modules/reports/components/WrapperWidgetTable.vue'

export default {
    components: {
        WrapperWidgetTable
    }
}
</script>
