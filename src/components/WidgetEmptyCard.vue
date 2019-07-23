<template>
    <div class="w-full lg:w-1/3 p-4 my-4 bg-gray-300 flex items-center justify-center rounded-lg shadow cursor-pointer">
        <div class="flex items-center justify-center"
             @click.stop="updateEditWidget">
            <IconPlusCircle class="w-12 mr-4 text-primary"></IconPlusCircle>
            <fade-transition>
                <WidgetMenu v-if="widgetGroup && widgetGroup.edit"
                            v-click-outside="onWidgetMenuClickOutside"
                            v-bind="$attrs"
                            v-on="$listeners">
                </WidgetMenu>
            </fade-transition>
        </div>
    </div>
</template>

<script>
    import WidgetMenu from './WidgetMenu'
    export default {
        name: "widget-empty-card",
        components:{
            WidgetMenu
        },
        props:{
            widgetGroup:{
                type: Object,
                default: null
            }
        },
        methods:{
            updateEditWidget(){
                this.$set(this.widgetGroup, 'edit', !this.widgetGroup.edit)
            },
            onWidgetMenuClickOutside(){
                this.widgetGroup.edit = false
            }
        }

    }
</script>

<style scoped>

</style>
