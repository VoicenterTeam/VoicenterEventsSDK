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
        <data-table :data="tableData"
                    :columns="columns"
        ></data-table>
    </div>
</template>

<script>
  import AddButton from '@/components/AddButton'
  import WidgetCard from '@/components/WidgetCard'
  import DraggableWidgets from '@/components/DraggableWidgets'
  import WidgetMenu from '@/components/WidgetMenu'
  import DataTable from "@/components/DataTable";

  export default {
    components: {
        DataTable,
      AddButton,
      WidgetCard,
      DraggableWidgets,
      WidgetMenu
    },
    data() {
      return {
        showWidgetMenu: false,
        tableData: [
            {
                id: 1,
                img: 'img/tania.jpg',
                name: 'Tania Mike',
                job: 'Develop',
                progress: 25,
                since: 2013,
                salary: '€ 99,225'
            },
            {
                id: 2,
                img: 'img/robi.jpg',
                name: 'John Doe',
                job: 'CEO',
                progress: 77,
                since: 2012,
                salary: '€ 89,241'
            },
            {
                id: 3,
                img: 'img/lora.jpg',
                name: 'Alexa Mike',
                job: 'Design',
                progress: 41,
                since: 2010,
                salary: '€ 92,144'
            },
            {
                id: 4,
                img: 'img/jana.jpg',
                name: 'Jana Monday',
                job: 'Marketing',
                progress: 50,
                since: 2013,
                salary: '€ 49,990'
            },
            {
                id: 5,
                img: 'img/mike.jpg',
                name: 'Paul Dickens',
                job: 'Develop',
                progress: 100,
                since: 2015,
                salary: '€ 69,201'
            },
            {
                id: 6,
                img: 'img/emilyz.jpg',
                name: 'Manuela Rico',
                job: 'Manager',
                progress: 15,
                since: 2012,
                salary: '€ 99,201'
            }
        ],
        columns: [
            {
                prop: 'name',
                label: 'Name'
            },
            {
                prop: 'job',
                label: 'Job'
            },
            {
                prop: 'progress',
                label: 'Progress'
            },
            {
                prop: 'since',
                label: 'Since'
            },
            {
                prop: 'salary',
                label: 'Salary'
            }
        ],
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
