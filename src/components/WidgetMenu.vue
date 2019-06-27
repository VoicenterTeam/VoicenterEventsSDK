<template>
    <div class="bg-white p-4 shadow rounded-lg absolute">
        <DraggableWidgets v-model="widgets">
            <div v-for="widget in widgets"
                 :key="widget.ID"
                 :class="widget.WidgetLayout.Classes || {}"
                 class="w-full lg:w-1/2 px-2">
                <WidgetCard v-bind="widget.WidgetConfig"></WidgetCard>
            </div>
        </DraggableWidgets>
    </div>
</template>
<script>
  import DraggableWidgets from '@/components/DraggableWidgets'
  import WidgetCard from '@/components/WidgetCard'
  export default {
    components: {
      WidgetCard,
      DraggableWidgets
    },
    props: {
      widgets: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
<style>
</style>
