<template>
    <div class="pt-24">
        <div class="flex justify-end relative mr-4">
            <AddButton @click="showWidgetMenu = !showWidgetMenu"></AddButton>
            <fade-transition>
                <WidgetMenu v-if="showWidgetMenu" class="absolute max-w-5xl bg-gray-300 mt-16" :widgets="allWidgets"></WidgetMenu>
            </fade-transition>
        </div>
        <fade-transition mode="out-in">
            <div :key="activeDashboard.ID">
                <div v-for="widgetGroup in activeDashboard.WidgetGroupList" :key="widgetGroup.ID">
                    <h3 class="font-semibold text-2xl text-gray-800">{{$t(widgetGroup.Title)}}</h3>
                    <DraggableWidgets :value="widgetGroup.WidgetList"
                                      @input="val => onListChange(val, widgetGroup)">
                        <div v-for="widget in widgetGroup.WidgetList"
                             :key="widget.ID"
                             :class="widget.WidgetLayout.Classes || {}"
                             class="w-full lg:w-1/3 px-2"
                        >
                            <WidgetCard v-bind="widget.WidgetConfig"></WidgetCard>
                        </div>
                    </DraggableWidgets>
                </div>
            </div>
        </fade-transition>
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
