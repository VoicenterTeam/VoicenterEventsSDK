<template>
    <div>
        <portal to="redirect-action">
          <span class="text-primary redirect-action"
                @click="allTemplateCategories()">
                <IconDirLeft class="mx-2"/>
                {{ $t('widget.allCategories') }}
            </span>
        </portal>
        <portal to="form-title">
            {{ $t(templateCategory.CategoryName) }}
        </portal>
        <portal to="additional-action">
            <span 
                class="mr-2"
            >
                <el-button
                    @click="tryAddAllWidgetsFromCategory()"
                    type="_primary"
                    class="button-add-all"
                >
                    <div class="flex items-center">
                        <IconAdd :class="$rtl.isRTL ? 'ml-1' : 'mr-1'"/>
                        <span
                            class="text-base"
                        >
                            {{ $t('widget.addAll') }}
                        </span>
                    </div>
                </el-button>
            </span>
        </portal>
        <div class="flex justify-center border-b py-4 -mx-4-5">
            <div class="w-full max-w-md">
                <el-input
                    v-model="search"
                    :placeholder="$t('general.search')"
                    class="input-search"
                >
                    <template v-slot:prefix>
                        <i class="el-input__icon vc-icon-search text-primary text-xl" />
                    </template>
                </el-input>
            </div>
        </div>
        <div class="flex flex-col -mx-4-5">
            <div :key="template.TemplateID"
                 class="w-full"
                 v-for="template in filteredTemplates">
                <TemplateCard
                    class="w-full"
                    :key="template.TemplateID"
                    :quantities="quantities"
                    v-bind="template"
                >
                    <template v-slot:new-one>
                        <el-button
                            @click="manageWidgets(1, template)"
                            size="mini"
                            class="button-add-one-widget text-center"
                            :key="template.TemplateID"
                            type="_primary"
                        >
                            <div class="flex items-center justify-center">
                                <IconAdd class="mb-0-5"
                                    :class="$rtl.isRTL ? 'ml-1' : 'mr-1'"/>
                                <span
                                    class="text-sm"
                                >
                                    {{ $t('general.add') }}
                                </span>
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
                            class="input-number"
                        />
                    </template>
                    <template v-slot:template-preview>
                        <el-tooltip :content="$t('widget.templateDictionary')"
                                    :open-delay="openDelay"
                                    class="item"
                                    effect="dark"
                                    placement="top">
                            <IconInfo
                                class="cursor-help text-primary"
                                @click="onPreviewTemplate(template)"
                            />
                        </el-tooltip>
                    </template>
                </TemplateCard>
            </div>
        </div>
        <portal to="form-footer">
            <div class="px-10">
                <el-button
                    @click="onSetupWidgets"
                    :disabled="submitDisabled"
                    class="button-set-up-widgets font-bold"
                    type="primary"
                >
                    {{ $t('widget.setUpWidgets') }}
                </el-button>
            </div>
        </portal>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import sum from 'lodash/sum'
    import cloneDeep from 'lodash/cloneDeep'
    import {InputNumber, Tooltip} from 'element-ui'

    export default {
        components: {
            TemplateCard: () => import('@/components/Widgets/AddWidgetsForm/TemplateCard'),
            [Tooltip.name]: Tooltip,
            [InputNumber.name]: InputNumber,
        },
        props: {
            widgetGroup: {
                type: Object,
                default: () => ({}),
            },
            submitDisabled: {
                type: Boolean,
                default: true
            }
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
                if (!this.templateList || !this.templateList.length) {
                    return
                }
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
                return `${this.$t('widget.summary')}: (${this.$t('widget.before')} - ${this.groupWidgetsCount}, ${this.$t('widget.afterAdding')} - ${this.afterAdding})`
            },
            getSummaries() {
                return this.$store.state.widgetCreation.summaries
            },
            getTemplate() {
                return this.$store.state.widgetCreation.templates
            },
        },
        methods: {
            translateTemplateName(tName) {
                return this.$t(tName) || tName
            },
            manageWidgets(value, template) {
                this.quantities[template.TemplateID] = value
                this.summaries[template.TemplateName] = value
                template.quantity = value

                this.templates[`${template.TemplateID}`] = template

                if (!value) {
                    delete this.summaries[template.TemplateName]
                    delete this.templates[template.TemplateID]
                    delete this.quantities[template.TemplateName]
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
                await this.$store.dispatch('widgetCreation/resetCopyTemplate')
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
                this.templates = cloneDeep(this.getTemplate) || {}
            },
            tryAddAllWidgetsFromCategory() {
                this.filteredTemplates.forEach(el => {
                    this.manageWidgets(1, el)
                })
                this.$emit('try-store-category', this.templateCategory)
            },
            tryUpdateSummary() {
                const summaries = {
                    summaryText: this.summaries,
                    quantities: this.quantities,
                }
                this.$emit('on-update-summary', summaries)
            },
        },
        mounted() {
            this.fillProgress()
            this.filteredTemplates.forEach(el => {
                if (el.quantity) {
                    const quantity = el.quantity !== 1 ? el.quantity : 1
                    this.manageWidgets(quantity, el)
                }
            })
        },
        watch: {
            quantities: {
                deep: true,
                handler() {
                    this.tryUpdateSummary()
                }
            }
        }
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
    .button-add-all {
        @apply px-4 py-0.5;
    }
    .input-search ::v-deep input::placeholder {
        @apply text-gray-500 font-normal text-sm;
    }
    ::v-deep .el-input--prefix .el-input__inner {
        @apply pl-11;
    }
    ::v-deep .el-input__prefix {
        @apply left-4;
    }
    .button-add-one-widget {
        @apply px-5 py-1 w-22.7 h-7;
    }
    .button-set-up-widgets {
        @apply px-4-5 py-1.5 text-base;
    }
    .input-number {
        @apply w-22.7 h-7;
        ::v-deep .el-input-number__decrease, ::v-deep .el-input-number__increase {
            @apply bg-white text-gray-950 font-bold w-6;
            height: 28px;
        }
        ::v-deep .el-input-number__decrease i, ::v-deep .el-input-number__increase i {
            @apply h-full flex justify-center items-center font-bold;
        }
        ::v-deep .el-input input {
            @apply w-22.7 h-7;
        }
    }
    ::v-deep .el-input-number--mini .el-input-number__decrease [class*=el-icon], ::v-deep .el-input-number--mini .el-input-number__increase [class*=el-icon] {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
</style>
