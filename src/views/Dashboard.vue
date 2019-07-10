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
        <new-group-button class="flex justify-end"
                          @click.native="addNewGroup"
                          v-if="editMode">
        </new-group-button>
        <fade-transition mode="out-in" :duration="250">
            <div :key="activeDashboardData.ID">
                <transition-group name="flip-list">
                    <div v-for="widgetGroup in activeDashboardData.WidgetGroupList" :key="widgetGroup.ID" class="my-10" :class="{'editable-widgets':editMode}">
                        <div v-if="editMode" class="flex items-center justify-between mb-8">
                            <base-input v-model="widgetGroup.Title"></base-input>
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
                            <widget-empty-card v-if="editMode" key="0"
                                               :widgets="allWidgets"
                                               :widget-group="widgetGroup"
                                               @add-widget="(value) => addWidgetToGroup(value, widgetGroup)"
                            ></widget-empty-card>

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
        <demo-table></demo-table>
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
  import NewGroupButton from "@/components/NewGroupButton";
  import BaseInput from "@/components/BaseInput";
  import WidgetEmptyCard from "@/components/WidgetEmptyCard";
  import DemoTable from './DemoTable'
  export default {
    components: {
      DemoTable,
      WidgetEmptyCard,
      BaseInput,
      NewGroupButton,
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
        activeDashboardData: cloneDeep(this.$store.state.dashboards.activeDashboard),
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
      addWidgetToGroup(widget, widgetGroup){
          let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID);
          this.activeDashboardData.WidgetGroupList[index].WidgetList.push(widget);
      },
      orderWidgetGroup(widgetGroup, direction) {
          let index = this.activeDashboardData.WidgetGroupList.findIndex(group => group.ID === widgetGroup.ID)
          let newIndex = index;
          if(direction === 'up' ){
              newIndex = index - 1;
          } else {
              newIndex= index + 1;
          }
          let originWidget = this.activeDashboardData.WidgetGroupList[index];
          let destinationWidget = this.activeDashboardData.WidgetGroupList[newIndex];

          if(newIndex < 0 ){
              let selectedGroup = this.activeDashboardData.WidgetGroupList[0];
              this.activeDashboardData.WidgetGroupList.splice(0, 1)
              this.activeDashboardData.WidgetGroupList.push(selectedGroup)

          } else if(newIndex >= this.activeDashboardData.WidgetGroupList.length) {
              let newPosition = this.activeDashboardData.WidgetGroupList.length-1;
              let selectedGroup = this.activeDashboardData.WidgetGroupList[newPosition];
              this.activeDashboardData.WidgetGroupList.splice(newPosition, 1)
              this.activeDashboardData.WidgetGroupList.splice(0, 0, selectedGroup)

          } else {
              this.activeDashboardData.WidgetGroupList.splice(newIndex, 1, originWidget)
              this.activeDashboardData.WidgetGroupList.splice(index, 1, destinationWidget)
          }

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
    .el-table__row .cell{
        @apply text-gray-500;
    }

</style>
