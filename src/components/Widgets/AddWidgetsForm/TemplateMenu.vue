<template>
    <div>
        <div class="flex w-full justify-center border-b pb-2">
            <div class="w-1/2">
                <el-input class="mb-2"
                          placeholder="Search"
                          size="small"
                          suffix-icon="el-icon-search"
                          v-model="search"/>
            </div>
        </div>
        <div class="flex -mx-2 flex-col">
            <div :key="widgetTemplate.TemplateID"
                 class="w-full px-2"
                 v-for="widgetTemplate in filteredWidgetTemplates">
                <TemplateCard class="w-full"
                            :key="widgetTemplate.TemplateID"
                            :quantities="quantities"
                            v-bind="widgetTemplate">
                    <template v-slot:new-one>
                        <el-button
                            @click="manageWidgets(1, widgetTemplate)"
                            size="mini"
                            class="w-24 text-center"
                            :key="widgetTemplate.TemplateID"
                            type="_primary">
                            <div class="flex items-center justify-center">
                                <IconAdd class="mb-0-5"
                                         :class="$rtl.isRTL ? 'ml-1' : 'mr-1'"/>
                                <span>{{ $t('Add') }}</span>
                            </div>
                        </el-button>
                    </template>
                    <template v-slot:quantity>
                        <el-input-number
                            :key="widgetTemplate.TemplateID"
                            :max="99"
                            :min="0"
                            size="mini"
                            placeholder="0"
                            v-model="quantities[widgetTemplate.TemplateID]"
                            @change="manageWidgets($event, widgetTemplate)"
                        />
                    </template>
                </TemplateCard>
            </div>
        </div>
    </div>
</template>
<script>
    import { InputNumber } from 'element-ui'
    import TemplateCard from '@/components/Widgets/AddWidgetsForm/TemplateCard'
    export default {
        components: {
            TemplateCard,
            [InputNumber.name]: InputNumber,
        },
        props: {
            widgetTemplates: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                search: '',
                quantities: {},
                templates: {},
            }
        },
        computed: {
            filteredWidgetTemplates() {
                return this.widgetTemplates.filter((widgetTemplate) => {
                    const templateName = this.translateTemplateName(widgetTemplate.TemplateName)
                    return widgetTemplate.TemplateID.toString() === this.search.toString() || templateName.toLowerCase().includes(this.search.toLowerCase())
                })
            },
        },
        methods: {
            manageWidgets(value, template) {
                this.quantities[`${template.TemplateID}`] = value
                template['quantity'] = value
                this.templates[`${template.TemplateID}`] = {
                    quantity: value,
                    templateName: template.TemplateName,
                    template: template,
                }
                this.$emit('on-manage-widgets', this.templates)
            },
            onPreviewTemplate(template) {
                this.$emit('on-preview', template)
            },
            translateTemplateName(tName) {
                return this.$t(tName) || tName
            },
        },
    }
</script>
<style lang="scss" scoped>
.widget-menu-footer {
    border-top: solid 1px var(--silver-color);
}

.text-main-xs {
    font-size: 11px;
    color: var(--cool-grey);
}
</style>
