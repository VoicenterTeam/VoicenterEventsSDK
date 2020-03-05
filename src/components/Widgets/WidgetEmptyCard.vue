<template>
    <div class="w-full lg:w-1/3 p-4 mt-4 bg-gray-300 flex items-center justify-center rounded-lg shadow cursor-pointer">
        <div class="flex items-center justify-center">
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.add.widgets')" placement="top">
                <IconPlusCircle class="w-12 mr-4 text-primary" @click.stop="updateEditWidget" ref="editGroup"/>
            </el-tooltip>
            <fade-transition>
                <templates-category
                    class="mb-12"
                    :class="getClass"
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
        computed: {
            getClass() {
                // Check if the button is close to the header
                if (this.$refs.editGroup.getBoundingClientRect().top < 250) {
                    return 'mt-24'
                }
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
