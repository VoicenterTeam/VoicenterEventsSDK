<template>
    <div class="p-4 shadow rounded-lg absolute max-w-5xl bg-gray-300 mt-16 z-10">
        <DraggableWidgets v-model="widgets"
                          :enable-transition="false"
                          :group="{ name: 'widgets', pull: 'clone', put: false }">
            <div v-for="widget in widgets"
                 :key="widget.ID"
                 :class="widget.WidgetLayout.Classes || {}"
                 class="w-full lg:w-1/2 px-2">
                <!-- TODO: update with other types, only card type now  -->
                <WidgetCard v-if="widget.WidgetType.ID === '1'" v-bind="widget.WidgetConfig"
                            @click.native="$emit('add-widget', widget)"
                ></WidgetCard>
            </div>
        </DraggableWidgets>
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
        }
    }
</script>
<style>
</style>
