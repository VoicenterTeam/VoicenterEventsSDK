<template>
    <div class="w-full lg:w-1/3 p-4 mt-4 bg-gray-300 flex items-center justify-center rounded-lg shadow cursor-pointer">
        <div class="flex items-center justify-center">
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.add.widgets')" placement="top">
                <IconPlusCircle class="w-12 mr-4 text-primary" @click.stop="updateEditWidget"/>
            </el-tooltip>
            <fade-transition>
                <templates-category
                        class="mb-12"
                        v-if="widgetGroup && widgetGroup.edit"
                        v-bind="$attrs"
                        v-click-outside="onWidgetMenuClickOutside"
                        :widgetGroup="widgetGroup"
                        v-on="$listeners">
                </templates-category>
            </fade-transition>
        </div>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import TemplatesCategory from './TemplatesCategory'

    export default {
        components: {
            TemplatesCategory,
            [Tooltip.name]: Tooltip,
        },
        props: {
            widgetGroup: {
                type: Object,
                default: () => ({})
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
