<template>
    <div>
        <el-input class="mb-2" placeholder="Search" size="small" suffix-icon="el-icon-search"
                  v-model="search"></el-input>
        <el-button
            @click="addAllWidgetsFromCategory"
            class="w-full"
            type="default">{{$t('Add all widgets')}}
        </el-button>
        <div class="widget-menu-container flex -mx-2 flex-col">
            <div :key="widgetTemplate.TemplateID"
                 class="w-full px-2"
                 v-for="widgetTemplate in filteredWidgetTemplates">
                <WidgetCard
                    @add-widget="addWidget(widgetTemplate)"
                    class="w-full cursor-pointer"
                    v-bind="widgetTemplate">
                    <template v-slot:quantity>
                        <el-input-number
                            :max="99"
                            :min="0"
                            :size="'mini'"
                            controls-position="right"
                            placeholder="0" v-model="quantities[widgetTemplate.TemplateID]">
                        </el-input-number>
                    </template>
                </WidgetCard>
            </div>
            <h3 class="text-center my-4" v-if="widgetTemplates.length === 0">
                {{$t('no.widgets.added')}}
            </h3>
        </div>
        <div class="flex items-center justify-between widget-menu-footer py-2">
            <p class="text-main-xs">{{$t('save.to.add')}}</p>
            <el-button :disabled="!validForSubmit" @click="addWidgets" size="small" type="primary">
                {{$t('common.save')}}
            </el-button>
        </div>
    </div>
</template>
<script>
    import times from 'lodash/times'
    import {InputNumber} from 'element-ui'
    import WidgetCard from './WidgetCard'

    export default {
        components: {
            WidgetCard,
            [InputNumber.name]: InputNumber
        },
        data () {
            return {
                search: '',
                quantities: {}
            }
        },
        props: {
            widgetTemplates: {
                type: Array,
                default: () => ([])
            },
            widgetGroup: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            filteredWidgetTemplates () {
                return this.widgetTemplates.filter((widgetTemplate) => {
                    const templateName = this.translateTemplateName(widgetTemplate.TemplateName)
                    if (templateName) {
                        return templateName.toLowerCase().includes(this.search.toLowerCase())
                    }
                    return false
                })
            },
            validForSubmit () {
                return Object.keys(this.quantities).filter(key => this.quantities[key] > 0).length
            },
        },
        methods: {
            translateTemplateName (tName) {
                return this.$t(tName)
            },
            addAllWidgetsFromCategory () {
                this.addWidgetsToGroup(this.widgetTemplates)
            },
            getDefaultGridLayout () {
                let rowCount = 2
                const gridStackContainer = document.getElementsByClassName('grid-stack')

                if (gridStackContainer) {
                    rowCount = gridStackContainer[0].getAttribute('data-gs-current-row');
                }

                return {
                    x: 0,
                    y: Number(rowCount),
                    width: 12,
                    height: 2,
                }
            },
            addWidgets () {

                let defaultLayout = this.getDefaultGridLayout()

                let widgetTemplateIdsToAdd = Object.keys(this.quantities).filter(key => this.quantities[key] > 0)
                let widgetTemplatesToAdd = []

                this.widgetTemplates.filter((template) => {
                    widgetTemplateIdsToAdd.includes(template.TemplateID)
                    template['WidgetLayout'] = {GridLayout: defaultLayout}
                    return times(this.quantities[template.TemplateID], () => {
                        widgetTemplatesToAdd.push(template)
                    })
                })

                this.addWidgetsToGroup(widgetTemplatesToAdd)
                this.$set(this.widgetGroup, 'edit', !this.widgetGroup.edit)
            },
            addWidgetsToGroup (widgetTemplatesToAdd) {

                let defaultLayout = this.getDefaultGridLayout()

                let layout = {...defaultLayout}

                widgetTemplatesToAdd.forEach((template) => {
                    if (!template['WidgetLayout']) {
                        layout.y = layout.y + 2
                        template['WidgetLayout'] = {GridLayout: layout}
                    }
                })

                let objectToEmit = {
                    widgets: widgetTemplatesToAdd,
                    group: this.widgetGroup
                }
                this.$emit('addWidgetsToGroup', objectToEmit)
            },
            addWidget (widgetTemplate) {
                let defaultLayout = this.getDefaultGridLayout()

                widgetTemplate['WidgetLayout'] = {GridLayout: defaultLayout}

                this.addWidgetsToGroup([widgetTemplate])
            }
        }
    }
</script>
<style lang="scss" scoped>

    .widget-menu-container {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .widget-menu-footer {
        border-top: solid 1px var(--silver-color);
    }

    .text-main-xs {
        font-size: 11px;
        color: var(--cool-grey);
    }
</style>
