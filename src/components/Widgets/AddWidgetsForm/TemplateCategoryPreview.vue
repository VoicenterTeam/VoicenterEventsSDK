<template>
    <div>
        <portal to="redirect-action">
          <span class="text-steel hover:text-primary redirect-action"
                @click="allTemplateCategories()">
                <IconDirLeft class="mx-1"/>
                {{ $t('All Categories') }}
            </span>
        </portal>
        <portal to="form-title">
            {{ $t(templateCategory.CategoryName) }}
        </portal>
        <portal to="additional-action">
            <el-button @click="tryAddAllWidgetsFromCategory()"
                       size="mini"
                       type="_primary">
                <div class="flex items-center">
                    <IconAdd :class="$rtl.isRTL ? 'ml-1' : 'mr-1'"/>
                    <span>{{ $t('Add All') }}</span>
                </div>
            </el-button>
        </portal>
        <div class="flex w-full justify-center border-b py-4">
            <div class="w-1/2">
                <el-input :placeholder="$t('Search')"
                          size="small"
                          suffix-icon="el-icon-search"
                          v-model="search"/>
            </div>
        </div>
        <div class="flex -mx-2 flex-col">
            <div :key="template.TemplateID"
                 class="w-full px-2"
                 v-for="template in filteredTemplates">
                <TemplateCard class="w-full"
                              :key="template.TemplateID"
                              :quantities="quantities"
                              v-bind="template">
                    <template v-slot:new-one>
                        <el-button
                            @click="manageWidgets(1, template)"
                            size="mini"
                            class="w-24 text-center"
                            :key="template.TemplateID"
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
                            :key="template.TemplateID"
                            :max="99"
                            :min="0"
                            size="mini"
                            placeholder="0"
                            v-model="quantities[template.TemplateID]"
                            @change="manageWidgets($event, template)"
                        />
                    </template>
                    <template v-slot:template-preview>
                        <el-tooltip :content="$t('Template Dictionary')"
                                    :open-delay="openDelay"
                                    class="item"
                                    effect="dark"
                                    placement="top">
                        <IconInfo class="cursor-help text-steel hover:text-primary"
                                  @click="onPreviewTemplate(template)"/>
                        </el-tooltip>
                    </template>
                </TemplateCard>
            </div>
        </div>
        <portal to="form-footer">
            <div class="border-t-2 border-gray-300 py-4 flex items-center justify-between">
                <div class="px-6">
                    <p class="text-xs leading-4 text-gray-900 font-bold mb-1">{{ getSummaryActions }}</p>
                    <p class="text-xs leading-4 text-gray-900">
                        <span v-for="(tQuantity, tName) in summaries">
                            {{ tName }}
                            <b> {{ $t('x') }}{{ tQuantity }}</b>;
                        </span>
                    </p>
                </div>
                <slot>
                    <div class="px-10">
                        <el-button @click="onSetupWidgets"
                                   :disabled="isEmpty(this.summaries)"
                                   class="font-bold"
                                   type="primary">
                            {{ $t('Set up Widgets') }}
                        </el-button>
                    </div>
                </slot>
            </div>
        </portal>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import sum from 'lodash/sum'
    import isEmpty from 'lodash/isEmpty'
    import cloneDeep from 'lodash/cloneDeep'
    import { InputNumber, Tooltip } from 'element-ui'
    import TemplateCard from '@/components/Widgets/AddWidgetsForm/TemplateCard'
    
    export default {
        components: {
            TemplateCard,
            [Tooltip.name]: Tooltip,
            [InputNumber.name]: InputNumber,
        },
        props: {
            widgetGroup: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                search: '',
                quantities: {},
                templates: {},
                summaries: {},
                openDelay: 200,
            }
        },
        computed: {
            templateCategory() {
                return this.$store.getters['widgetCreation/getCategoryTemplates']
            },
            templateList() {
                return this.templateCategory.TemplatesList || []
            },
            filteredTemplates() {
                return this.templateList.filter((template) => {
                    const templateName = this.translateTemplateName(template.TemplateName)
                    return template.TemplateID.toString() === this.search.toString() || templateName.toLowerCase().includes(this.search.toLowerCase())
                })
            },
            groupWidgetsCount() {
                const group = this.widgetGroup
                return get(group, 'WidgetList', []).length
            },
            afterAdding() {
                const activeWidgets = this.groupWidgetsCount || 0
                const newWidgetsCount = sum(Object.values(this.quantities)) || 0
                return +newWidgetsCount + +activeWidgets
            },
            getSummaryActions() {
                return `${this.$t('Summary')}: (${this.$t('before')} - ${this.groupWidgetsCount}, ${this.$t('after adding')} - ${this.afterAdding})`
            },
            getSummaries() {
                return this.$store.state.widgetCreation.summaries
            },
            getTemplate() {
                return this.$store.state.widgetCreation.templates
            },
        },
        methods: {
            isEmpty,
            translateTemplateName(tName) {
                return this.$t(tName) || tName
            },
            manageWidgets(value, template) {
                this.quantities[template.TemplateID] = value
                this.summaries[template.TemplateName] = value
                template['quantity'] = value
                
                this.templates[`${template.TemplateID}`] = template
                
                if (!value) {
                    delete this.summaries[template.TemplateName]
                }
            },
            async onPreviewTemplate(template) {
                const objectToStore = {
                    template,
                    data: this.composeSummary(),
                }
                await this.$store.dispatch('widgetCreation/previewTemplate', objectToStore)
            },
            async allTemplateCategories() {
                await this.$store.dispatch('widgetCreation/resetState')
            },
            composeSummary() {
                return {
                    templates: this.templates,
                    summaries: {
                        summaryText: this.summaries,
                        quantities: this.quantities,
                    },
                }
            },
            async onSetupWidgets() {
                const data = this.composeSummary()
                await this.$store.dispatch('widgetCreation/goToSetupTemplates', data)
            },
            fillProgress() {
                if (!this.getSummaries) {
                    return
                }
                const summaries = this.getSummaries
                this.quantities = cloneDeep(summaries.quantities)
                this.summaries = cloneDeep(summaries.summaryText)
                this.templates = cloneDeep(this.getTemplate)
            },
            tryAddAllWidgetsFromCategory() {
                this.$emit('try-store-category', this.templateCategory)
            },
        },
        mounted() {
            this.fillProgress()
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
