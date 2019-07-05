<template>
    <div class="pt-24">
        <div class="flex justify-end relative my-4">
            <EditButton  class="mx-3" @click.stop="editMode = !editMode"></EditButton>
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
                <div v-for="widgetGroup in activeDashboard.WidgetGroupList" :key="widgetGroup.ID" class="my-10" :class="{'editable-widgets':editMode}">
                    <div v-if="editMode" class="flex items-center justify-between mb-8">
                        <div class="flex items-center border-b border-b-2 border-blue-500 py-2">
                            <input class="appearance-none bg-transparent border-none w-full text-blue font-bold mr-3 py-1 px-2 leading-tight focus:outline-none"
                                   type="text" :placeholder="$t(widgetGroup.Title)" aria-label="Full name">
                        </div>
                        <Trash2Icon  class="flex align-center w-6 h-6 text-red"></Trash2Icon>
                    </div>
                    <h3 v-else class="font-semibold text-2xl text-gray-800">{{$t(widgetGroup.Title)}}</h3>
                    <DraggableWidgets group="widgets"
                                      :value="widgetGroup.WidgetList"
                                      @input="val => onListChange(val, widgetGroup)">
                        <div v-for="(widget, index) in widgetGroup.WidgetList"
                             :key="widget.ID"
                             :class="widget.WidgetLayout.Classes || {}"
                             class="w-full lg:w-1/3 px-2">
                            <WidgetCard v-bind="widget.WidgetConfig"
                                        :editable="editMode"
                                        @remove-item="removeWidget(widgetGroup, index)"></WidgetCard>
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
  import EditButton from "@/components/EditButton";
  import { Trash2Icon } from 'vue-feather-icons'
  export default {
    components: {
        Trash2Icon,
        EditButton,
      AddButton,
      WidgetCard,
      DraggableWidgets,
      WidgetMenu
    },
    data() {
      return {
        showWidgetMenu: false,
        editMode: false
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
      },
      removeWidget(widgetGroup, index){
        widgetGroup.WidgetList.splice(index,1)
      }
    }
  }
</script>
<style>
    .editable-widgets{
        opacity: 0.7;
        @apply bg-gray-100 rounded-lg;

        border-radius: 10px;
        min-width: 460px;
        @apply p-8;
        @apply shadow;
    }
</style>
