<template>
<div>
    <div class="flex items-center pb-6 border-b border-gray-300">
        <IconWidgetGroup class="text-primary"/>
        <span class="mx-1 text-xl font-bold text-gray-900">
            {{ $t('Widget Group Management') }}
        </span>
    </div>
    <div class="flex items-center py-6 border-b border-gray-300"
         v-for="widgetGroup in activeDashboard.WidgetGroupList"
         :key="widgetGroup.WidgetGroupID">
        <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
                <IconMoveUp class="text-gray-500 hover:text-primary"
                            @click="onMove('up', widgetGroup)"/>
                <IconMoveDown class="text-gray-500 hover:text-primary"
                              @click="onMove('down', widgetGroup)"/>
                <span class="mx-2">{{ widgetGroup.WidgetGroupTitle ||`# ${ widgetGroup.WidgetGroupID}` }}</span>
            </div>
            <div class="flex cursor-pointer">
                <IconShape class="text-gray-500 hover:text-primary"/>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    inheritAttrs: false,
    props: {
        activeDashboard: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {}
    },
    methods: {
        onMove(direction, widgetGroup) {
        
        },
    },
    watch: {},
}
</script>
