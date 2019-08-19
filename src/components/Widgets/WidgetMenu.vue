<template>
    <div class="p-4 shadow rounded-lg absolute max-w-xl bg-gray-300 mt-16 z-10 widget-menu">
        <DraggableWidgets v-model="widgets"
                          :enable-transition="false"
                          :group="{ name: 'widgets', pull: 'clone', put: false }">
            <div v-for="widget in widgets"
                 :key="widget.WidgetID"
                 :class="widget.WidgetLayout.Classes || {}"
                 class="w-full px-2">
                <!-- TODO: update with other types, only card type now  -->
<!--                v-if="widget.TemplateID === 1"-->
                <WidgetCard  v-bind="widget.WidgetLayout"
                            @click.native="$emit('add-widget', widget)"
                ></WidgetCard>
            </div>
        </DraggableWidgets>
        <h3 v-if="widgets.length === 0" class="text-2xl text-center mt-5">
            There are no widgets added yet
        </h3>
    </div>
</template>
<script>
    import DraggableWidgets from './DraggableWidgets'
    import WidgetCard from './WidgetCard'

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
        },
    }
</script>
<style scoped>
    .widget-menu {
        height: 500px;
        overflow: auto;
        min-width: 500px;
    }
</style>
