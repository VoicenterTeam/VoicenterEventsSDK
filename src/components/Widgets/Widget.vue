<template>
    <div class="relative">
        <div class="absolute top-0 right-0 mr-12 widget-delete__button" v-if="editable && showDeleteButton">
            <delete-button @click="removeWidget(widget)"/>
        </div>
        <div class="absolute top-0 right-0 widget-edit__button" v-if="showDeleteButton">
            <edit-button @click="onShowUpdateDialog(widget.TemplateID)"
                         :class="{'border border-primary': editable}">
            </edit-button>
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
        <!--TODO: set dynamic edit dialog for all widget types-->
        <update-dialog
            width="30%"
            :chartTitle="widget.Title"
            @on-change="onChangeTitle"
            :visible.sync="showUpdateDialog">
        </update-dialog>
    </div>
</template>
<script>

    import WidgetCard from "./WidgetCard"
    import UpdateDialog from './UpdateDialog'
    import widgetTypes from '@/enum/widgetTypes'
    import EditButton from '@/components/EditButton'
    import DataTable from '@/components/Table/DataTable'
    import DeleteButton from "@/components/Widgets/DeleteButton";
    import TimeLineChart from '@/components/Charts/TimeLineChart'
    import ExtensionCards from '@/components/Cards/ExtensionCards'
    import StatusCards from '@/components/Cards/StatusCards'
    import StatisticsCards from '@/components/Cards/StatisticsCards'

    export default {
        name: "widget",
        components: {
            WidgetCard,
            TimeLineChart,
            ExtensionCards,
            StatusCards,
            StatisticsCards,
            DataTable,
            DeleteButton,
            EditButton,
            UpdateDialog
        },
        props: {
            editable: {
                type: Boolean,
                default: false
            },
            widget: {
                type: Object,
                default: () => ({})
            }
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
                showUpdateDialog: false
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
            onShowUpdateDialog(TemplateID) {
                if (TemplateID != 2) {
                    alert('coming soon...')
                    return
                }
                this.showUpdateDialog = true
            },
            onChangeTitle(title) {
                this.widget.WidgetLayout.Title = title
                this.widget = {...this.widget, ...this.widget.WidgetLayout}
                this.$emit('update-item', this.widget)
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
                this.$emit('update-item', this.widget)
            }
        }
    }
</script>
<style scoped lang="scss">
    .rtl {
        .widget-edit__button {
            right: auto;
            @apply left-0;
        }

        .widget-delete__button {
            right: auto;
            @apply left-0;
            + .widget-edit__button {
                right: auto;
                @apply ml-10;
                @apply left-0;
            }
        }

    }
</style>
