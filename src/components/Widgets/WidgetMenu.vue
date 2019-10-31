<template>
    <div>
        <el-input size="small" class="mb-2" placeholder="Search" v-model="search"
                  suffix-icon="el-icon-search"></el-input>
        <div class="widget-menu-container">
            <DraggableWidgets v-model="widgetTemplates"
                              :enable-transition="false"
                              :group="{ name: 'widgetTemplates', pull: 'clone', put: false }">
                <div v-for="widgetTemplate in filteredWidgetTemplates"
                     :key="widgetTemplate.TemplateID"
                     class="w-full px-2">
                    <WidgetCard
                        v-bind="widgetTemplate"
                        class="w-full"
                        @add-widget="$emit('add-widget', widgetTemplate)">
                        <template v-slot:quantity>
                            <el-input-number :size="'mini'"
                                             controls-position="right"
                                             placeholder="0"
                                             v-model="quantities[widgetTemplate.TemplateID]"
                                             :min="0" :max="99">
                            </el-input-number>
                        </template>
                    </WidgetCard>
                </div>
            </DraggableWidgets>
            <h3 v-if="widgetTemplates.length === 0" class="text-xl text-center my-4">
                {{$t('no.widgets.added')}}
            </h3>
        </div>
        <div class="flex items-center justify-between widget-menu-footer py-2">
            <p class="text-xs">{{$t('save.to.add')}}</p>
            <el-button type="primary" size="small" @click="addWidgets" :disabled="!validForSubmit">
                {{$t('common.save')}}
            </el-button>
        </div>
    </div>
</template>
<script>
    import times from 'lodash/times'
    import {InputNumber} from 'element-ui'
    import WidgetCard from './WidgetCard'
    import DraggableWidgets from './DraggableWidgets'

    export default {
        components: {
            WidgetCard,
            DraggableWidgets,
            [InputNumber.name]: InputNumber
        },
        data() {
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
            filteredWidgetTemplates() {
                return this.widgetTemplates.filter((widgetTemplate) => {
                    if (widgetTemplate.TemplateName) {
                        return widgetTemplate.TemplateName.toLowerCase().includes(this.search.toLowerCase())
                    }
                    return false
                })
            },
            validForSubmit() {
                return Object.keys(this.quantities).filter(key => this.quantities[key] > 0).length
            },
        },
        methods: {
            addWidgets() {
                let widgetTemplateIdsToAdd = Object.keys(this.quantities).filter(key => this.quantities[key] > 0)
                let widgetTemplatesToAdd = []

                this.widgetTemplates.filter((template) => {
                    widgetTemplateIdsToAdd.includes(template.TemplateID)
                    return times(this.quantities[template.TemplateID], () => {
                        widgetTemplatesToAdd.push(template)
                    })
                })
                let objectToEmit = {
                    widgets: widgetTemplatesToAdd,
                    group: this.widgetGroup
                }
                this.$emit('addWidgetsToGroup', objectToEmit)
                this.$set(this.widgetGroup, 'edit', !this.widgetGroup.edit)
            }
        }
    }
</script>
<style scoped lang="scss">

    .widget-menu-container {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .widget-menu-footer {
        border-top: solid 1px var(--silver-color);
    }

    .text-xs {
        font-size: 11px;
        color: var(--cool-grey);
    }
</style>
