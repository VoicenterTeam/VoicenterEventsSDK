<template>
    <div class="pt-24">
        <div class="flex justify-end relative my-4">
            <AddButton @click.stop="showWidgetMenu = !showWidgetMenu"></AddButton>
            <EditButton  class="ml-3"
                         @click.stop="editMode = !editMode"
                         @reset-dashboard="resetDashboard"
                         @save-dashboard="saveDashboard"
                         :edit-mode="editMode"></EditButton>
            <fade-transition>
                <WidgetMenu v-if="showWidgetMenu"
                            v-click-outside="onWidgetMenuClickOutside"
                            :widgets="allWidgets">
                </WidgetMenu>
            </fade-transition>
        </div>
        <div class="flex justify-end" v-if="editMode">
            <button class="btn flex items-center p-4 text-blue shadow rounded bg-white hover:bg-blue-100 cursor-pointer" @click="addNewGroup">
                <IconPlus class="w-3 mr-1 mb-1 fill-current"></IconPlus>
                <span class="text-xs">{{$t('common.newGroup')}}</span>
            </button>
        </div>
        <fade-transition mode="out-in" :duration="250">
            <div :key="activeDashboardData.ID">
                <transition-group name="flip-list">
                    <div v-for="widgetGroup in activeDashboardData.WidgetGroupList" :key="widgetGroup.ID" class="my-10" :class="{'editable-widgets':editMode}">
                        <div v-if="editMode" class="flex items-center justify-between mb-8">
                            <div class="flex items-center border-b border-b-2 border-blue-500 py-2">
                                <input class="appearance-none bg-transparent border-none w-full text-blue font-bold mr-3 py-1 px-2 leading-tight focus:outline-none"
                                       v-model="widgetGroup.Title"
                                       :placeholder="$t('common.setGroupTitle')"
                                       type="text"
                                       aria-label="Full name">
                            </div>
                            <edit-group-buttons @remove-group="removeWidgetGroup(widgetGroup)"
                                                @move-up="orderWidgetGroup(widgetGroup, 'up')"
                                                @move-down="orderWidgetGroup(widgetGroup, 'down')">
                            </edit-group-buttons>
                        </div>
                        <h3 v-else class="font-semibold text-2xl text-gray-800">{{widgetGroup.Title}}</h3>
                        <DraggableWidgets group="widgets"
                                          :value="widgetGroup.WidgetList"
                                          @input="val => onListChange(val, widgetGroup)">
                            <div v-for="widget in widgetGroup.WidgetList"
                                 :key="widget.ID"
                                 :class="widget.WidgetLayout.Classes || {}"
                                 class="w-full lg:w-1/3 px-2">
                                <WidgetCard v-bind="widget.WidgetConfig"
                                            :editable="editMode"
                                            @remove-item="removeWidget(widgetGroup, widget)"></WidgetCard>
                            </div>
                            <div v-if="editMode" class="w-full lg:w-1/3 p-4 my-4 bg-gray-300 flex items-center justify-center rounded-lg shadow cursor-pointer" key="0">
                                <div class="flex items-center justify-center"
                                     @click.stop="updateEditWidget(widgetGroup)">
                                    <IconPlusCircle class="w-12 mr-4 text-blue"></IconPlusCircle>
                                    <fade-transition>
                                        <WidgetMenu v-if="widgetGroup.edit"
                                                    v-click-outside="onWidgetMenuClickOutside"
                                                    @add-widget="(value) => addWidgetToGroup(value, widgetGroup)"
                                                    :widgets="allWidgets">
                                        </WidgetMenu>
                                    </fade-transition>
                                </div>
                            </div>
                            <div v-if="widgetGroup.WidgetList.length === 0"
                                 class="w-full flex flex-col items-center mt-20"
                                 key="no-data">
                                <IconNoData v-if="!editMode" class="h-56 w-56"></IconNoData>
                                <p class="text-gray-600 max-w-lg text-center">{{$t('dashboards.widgets.noData')}}</p>
                            </div>
                        </DraggableWidgets>
                    </div>
                </transition-group>
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
  import EditGroupButtons from '@/components/EditGroupButtons'
  import { Trash2Icon } from 'vue-feather-icons'
  import cloneDeep from 'lodash/cloneDeep'
  export default {
    components: {
        EditGroupButtons,
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
        showWidgetMenu2: false,
        editMode: false,
        activeDashboardData: cloneDeep(this.$store.state.dashboards.activeDashboard)
      }
    },
    computed: {
      dashboard(){
        return this.$store.state.dashboards.activeDashboard
      },
      allWidgets() {
        return this.$store.state.widgets.allWidgets
      }
    },
    methods: {
      updateEditWidget(widgetGroup){
          this.$set(widgetGroup, 'edit', !widgetGroup.edit)
      },
      addWidgetToGroup(widget, widgetGroup){
          let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID);
          this.activeDashboardData.WidgetGroupList[index].WidgetList.push(widget);
      },
      orderWidgetGroup(widgetGroup, direction) {
          let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
          let newIndex = index;
          if(direction === 'up' && index - 1 > 0 ){
              newIndex = index - 1;
          } else if ( index+1 < this.activeDashboardData.WidgetGroupList.length) {
              newIndex= index + 1;
          }
          let originWidget = this.activeDashboardData.WidgetGroupList[index];
          let destinationWidget = this.activeDashboardData.WidgetGroupList[newIndex];


          this.activeDashboardData.WidgetGroupList.splice(newIndex, 1, originWidget )
          this.activeDashboardData.WidgetGroupList.splice(index, 1, destinationWidget)

      },
      onListChange(widgets, widgetGroup) {
          let newWidgetGroup = {
              ...widgetGroup,
              WidgetList: widgets
          }
          let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
          if (index !== -1) {
              this.activeDashboardData.WidgetGroupList.splice(index, 1, newWidgetGroup)
          }
      },
      onWidgetMenuClickOutside() {
        this.showWidgetMenu = false
      },
      removeWidget(widgetGroup, widget){
          let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
          if (index !== -1) {
              let widgetIndex = this.activeDashboardData.WidgetGroupList[index].WidgetList.findIndex(widgetItem => widgetItem.ID === widget.ID)
              if (index !== -1) {
                  this.activeDashboardData.WidgetGroupList[index].WidgetList.splice(widgetIndex, 1 )
              }
          }
      },
      removeWidgetGroup(widgetGroup){
          let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
          if (index !== -1) {
              this.activeDashboardData.WidgetGroupList.splice(index, 1)
          }
      },
      addNewGroup(){
          let widget = {
              "ID": Math.random() * 100,
              "Title": "",
              "WidgetList": []
          }
          this.activeDashboardData.WidgetGroupList.splice(0, 0 ,widget)
      },
      saveDashboard() {
          let dashboard = this.activeDashboardData
          this.$store.dispatch('dashboards/updateDashboard', { dashboard })
      } ,
      resetDashboard(){
          let dashboard = this.$store.state.dashboards.activeDashboard
          this.$store.dispatch('dashboards/updateDashboard', { dashboard })
          this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
      }
    },
    watch:{
      dashboard(){
          this.activeDashboardData = cloneDeep(this.$store.state.dashboards.activeDashboard)
      }
    }
  }
</script>
<style>
    .editable-widgets{
        @apply bg-gray-100 rounded-lg;

        border-radius: 10px;
        min-width: 460px;
        @apply p-8;
        @apply shadow;
    }
    .flip-list-move {
        transition: transform 0.5s;
    }
</style>
