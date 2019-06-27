<template>
    <div class="mt-10">
        <div class="flex justify-end mb-4 relative">
            <AddButton @click="showWidgetMenu = !showWidgetMenu"></AddButton>
            <fade-transition>
                <WidgetMenu v-if="showWidgetMenu" class="absolute max-w-5xl bg-gray-300 mt-16" :widgets="allWidgets"></WidgetMenu>
            </fade-transition>
        </div>
        <DraggableWidgets v-for="widgetGroup in activeDashboard.WidgetGroupList"
                          :value="widgetGroup.WidgetList"
                          @input="val => onListChange(val, widgetGroup)"
                          :key="widgetGroup.ID">
            <div v-for="widget in widgetGroup.WidgetList"
                 :key="widget.ID"
                 :class="widget.WidgetLayout.Classes || {}"
                 class="w-full lg:w-1/3 px-2"
            >
                <WidgetCard v-bind="widget.WidgetConfig"></WidgetCard>
            </div>
        </DraggableWidgets>
    </div>
</template>

<script>
  import AddButton from '@/components/AddButton'
  import WidgetCard from '@/components/WidgetCard'
  import DraggableWidgets from '@/components/DraggableWidgets'
  import WidgetMenu from '@/components/WidgetMenu'
  import { FadeTransition } from 'vue2-transitions'

  export default {
    components: {
      AddButton,
      WidgetCard,
      DraggableWidgets,
      WidgetMenu,
      FadeTransition
    },
    data() {
      return {
        showWidgetMenu: false
      }
    },
    computed: {
      activeDashboard() {
        return this.$store.state.dashboards.activeDashboard
      },
      allWidgets() {
        return this.$store.state.widgets.allWidgets
      }
    },
    methods: {
      onListChange(widgets, widgetGroup) {
        this.$store.dispatch('dashboards/updateWidgets', { widgets, widgetGroup })
        this.showWidgetMenu = false
      }
    }
  }
</script>
<style>
</style>
