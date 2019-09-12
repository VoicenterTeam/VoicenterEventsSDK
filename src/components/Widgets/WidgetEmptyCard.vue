<template>
    <div class="w-full lg:w-1/3 p-4 my-4 bg-gray-300 flex items-center justify-center rounded-lg shadow cursor-pointer">
        <div class="flex items-center justify-center"
             @click.stop="updateEditWidget">
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.add.widgets')" placement="top">
                <IconPlusCircle class="w-12 mr-4 text-primary"></IconPlusCircle>
            </el-tooltip>
            <fade-transition>
                <WidgetMenu v-if="widgetGroup && widgetGroup.edit"
                            v-click-outside="onWidgetMenuClickOutside"
                            v-bind="$attrs"
                            :widgets="allWidgets"
                            v-on="$listeners">
                </WidgetMenu>
            </fade-transition>
        </div>
    </div>
</template>

<script>
    import {Tooltip} from 'element-ui'
    import WidgetMenu from './WidgetMenu'

    export default {
        name: "widget-empty-card",
        components: {
            WidgetMenu,
            [Tooltip.name]: Tooltip
        },
        props: {
            widgetGroup: {
                type: Object,
                default: null
            },
            allWidgets: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            updateEditWidget() {
                this.$set(this.widgetGroup, 'edit', !this.widgetGroup.edit)
            },
            onWidgetMenuClickOutside() {
                this.widgetGroup.edit = false
            }
        },
    }
</script>

<style scoped>

</style>
