<template>
    <div class="relative">
        <div class="absolute top-0 right-0 mr-12" v-if="editable && showDeleteButton">
            <delete-button @click="removeWidget(widget)" class="delete-button"/>
        </div>
        <component :is="componentTypes[widget.TemplateID]"
                   :data="setComponentData(widget.TemplateID)"
                   v-bind="widget.WidgetLayout"
                   :editable="editable"
                   class="widget"
                   @update-item="(layout) => updateWidget(layout, widget)"
                   @change-extension-status="(status)=> changeExtensionStatus(status, widget)"
                   @remove-item="removeWidget(widget)">
        </component>
    </div>
</template>
<script>

  import WidgetCard from "./WidgetCard"
  import TimeLineChart from '@/components/Charts/TimeLineChart'
  import DataTable from '@/components/Table/DataTable'
  import ExtensionCards from '@/components/Cards/ExtensionCards'
  import StatusCards from '@/components/Cards/StatusCards'
  import StatisticsCards from '@/components/Cards/StatisticsCards'
  import widgetTypes from '@/enum/widgetTypes'
  import DeleteButton from "@/components/Widgets/DeleteButton";

  export default {
        name: "widget",
        components: {
            WidgetCard,
            TimeLineChart,
            ExtensionCards,
            StatusCards,
            StatisticsCards,
            DataTable,
            DeleteButton
        },
        props: {
          editable: {
            type: Boolean,
            default: false
          },
          widget: {
            type: Object,
            default: () => ({})
          },
        },
        data() {
            return {
                componentTypes: {
                    [widgetTypes.WIDGET_TYPE_ID]: 'WidgetCard',
                    [widgetTypes.CHART_TYPE_ID]: 'TimeLineChart',
                    [widgetTypes.TABLE_TYPE_ID]: 'DataTable',
                    [widgetTypes.EXTENSION_CARDS_TYPE_ID]: 'ExtensionCards',
                    [widgetTypes.STATUS_CARDS_TYPE_ID]: 'StatusCards',
                    [widgetTypes.STATISTICS_CARDS_TYPE_ID]: 'StatisticsCards',
                },
            }
        },
        computed:{
            showDeleteButton(){
                return ![widgetTypes.STATUS_CARDS_TYPE_ID, widgetTypes.STATISTICS_CARDS_TYPE_ID].includes(Number(this.widget.TemplateID))
            }
        },
        methods: {
            removeWidget(widget) {
                this.$emit('remove-item', widget)
            },
            updateWidget(widget) {
                this.$emit('update-item', widget)
            },
            setComponentData(TemplateID) {
                // TODO We need a better way to check this when integrating with the api
                if (TemplateID === 2 || TemplateID === '2') {
                    return this.widget;
                }
                return this.widget.WidgetLayout
            },
            changeExtensionStatus(status, widget){
                widget.WidgetLayout.status = status
                this.updateWidget(widget)
            }
        }
    }
</script>
<style scoped>
</style>
