<template>
    <div class="pt-24">
        <div class="flex justify-end relative mr-4">
            <AddButton @click.stop="showWidgetMenu = !showWidgetMenu"></AddButton>
            <fade-transition>
                <WidgetMenu v-if="showWidgetMenu"
                            v-click-outside="onWidgetMenuClickOutside"
                            :widgets="allWidgets">
                </WidgetMenu>
            </fade-transition>
        </div>
        <fade-transition mode="out-in" :duration="250">
            <div :key="activeDashboard.ID">
                <div v-for="widgetGroup in activeDashboard.WidgetGroupList" :key="widgetGroup.ID">
                    <h3 class="font-semibold text-2xl text-gray-800">{{$t(widgetGroup.Title)}}</h3>
                    <DraggableWidgets group="widgets"
                                      :value="widgetGroup.WidgetList"
                                      @input="val => onListChange(val, widgetGroup)">
                        <div v-for="widget in widgetGroup.WidgetList"
                             :key="widget.ID"
                             :class="widget.WidgetLayout.Classes || {}"
                             class="w-full lg:w-1/3 px-2">
                            <WidgetCard v-bind="widget.WidgetConfig"></WidgetCard>
                        </div>
                        <div v-if="widgetGroup.WidgetList.length === 0"
                             class="w-full flex flex-col items-center mt-20"
                             key="no-data">
                            <IconNoData class="h-56 w-56"></IconNoData>
                            <p class="text-gray-600 max-w-lg text-center">{{$t('dashboards.widgets.noData')}}</p>
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

  export default {
    components: {
      AddButton,
      WidgetCard,
      DraggableWidgets,
      WidgetMenu
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
      },
      onWidgetMenuClickOutside() {
        this.showWidgetMenu = false
      }
    }
  }
</script>
<style>
</style>
