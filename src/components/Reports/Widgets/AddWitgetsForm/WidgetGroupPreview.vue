<template>
    <div>
        <portal to="redirect-action">
          <span class="text-primary redirect-action"
                @click="goToWidgetGroups">
                <IconDirLeft class="mx-2"/>
                {{ $t('general.back') }}
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
                    @click="addAllWidgetsFromWidgetGroup"
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
            <div :key="widget.WidgetID"
                 class="w-full"
                 v-for="widget in widgetList">
                <WidgetCard
                    class="w-full"
                    :widget="widget"
                    v-on="$listeners"
                >
                    <template v-slot:new-one>
                        <el-button
                            @click="manageWidgets(1, widget)"
                            size="mini"
                            class="button-add-one-widget text-center"
                            :key="widget.TemplateID"
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
                    <template v-slot:template-preview>
                        <el-tooltip :content="$t('widget.templateDictionary')"
                                    :open-delay="openDelay"
                                    class="item"
                                    effect="dark"
                                    placement="top">
                            <IconInfo
                                class="cursor-help text-primary"
                                @click="onPreviewTemplate(widget)"
                            />
                        </el-tooltip>
                    </template>
                </WidgetCard>
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
import WidgetCard from "@/components/Reports/Widgets/AddWitgetsForm/WidgetCard";

export default {
    components: {
        WidgetCard,
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
        },
        selectedWidgets: {
            type: Array,
            default: () => []
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
        widgetList() {
            return get(this.widgetGroup, 'WidgetList', [])
        },
        filteredWidgetList() {
            if (!this.widgetList || !this.widgetList.length) {
                return []
            }
            return this.widgetList.filter((widget) => {
                const widgetName = widget.Title
                return widget.TemplateID.toString() === this.search.toString() || widgetName.toLowerCase().includes(this.search.toLowerCase())
            })
        },
        // templateList() {
        //     return this.templateCategory.TemplatesList || []
        // },
        // filteredTemplates() {
        //     if (!this.templateList || !this.templateList.length) {
        //         return
        //     }
        //     return this.templateList.filter((template) => {
        //         const templateName = this.translateTemplateName(template.TemplateName)
        //         return template.TemplateID.toString() === this.search.toString() || templateName.toLowerCase().includes(this.search.toLowerCase())
        //     })
        // },
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
        manageWidgets(value, widget) {
            this.quantities[widget.WidgetID] = value
            this.summaries[widget.WidgetID] = value
            // widget.quantity = value

            // this.templates[`${widget.TemplateID}`] = widget

            if (!value) {
                delete this.summaries[widget.WidgetID]
                // delete this.templates[widget.TemplateID]
                delete this.quantities[widget.WidgetID]
            }
        },
        async onPreviewTemplate(template) {
            const objectToStore = {
                template,
                data: this.composeSummary(),
            }
            // await this.$store.dispatch('widgetCreation/previewTemplate', objectToStore)
        },
        async goToWidgetGroups() {
            console.log('click back')
            await this.$emit('go-to-widget-groups')
            // await this.$store.dispatch('widgetCreation/resetCopyTemplate')
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
            // await this.$store.dispatch('widgetCreation/goToSetupTemplates', data)
        },
        fillProgress() {
            if (!this.getSummaries) {
                return
            }
            const summaries = this.getSummaries
            this.quantities = cloneDeep(summaries.quantities)
            this.summaries = cloneDeep(summaries.summaryText)
            // this.templates = cloneDeep(this.getTemplate) || {}
        },
        addAllWidgetsFromWidgetGroup() {
            // this.filteredWidgetList.forEach(el => {
            //     this.manageWidgets(1, el)
            // })
            //this.$emit('try-store-category', this.templateCategory)
            this.$emit('add-all-widgets-from-group', this.widgetGroup.WidgetGroupID)
        },
        tryUpdateSummary() {
            const summaries = {
                summaryText: this.summaries,
                quantities: this.quantities,
            }
            this.$emit('on-update-summary', summaries)
        },
        handleCheckedWidgets (selectedWidgets = this.selectedWidgets) {
            const widgetList = get(this.widgetGroup, 'WidgetList', [])
            widgetList.forEach(widget => {
                const isChecked = selectedWidgets.includes(widget.WidgetID)
                console.log('widget.WidgetID', widget.WidgetID)
                console.log('isChecked', isChecked)
                this.$set(widget, 'isChecked', isChecked)
            })
            console.log('widgetList', widgetList)
        }
    },
    mounted() {
        console.log('WidgetGroupPreview mounted')
        // this.fillProgress()
        // this.filteredWidgetList.forEach(widget => {
        //     this.manageWidgets(1, widget)
        // })
        this.handleCheckedWidgets()
    },
    watch: {
        quantities: {
            deep: true,
            handler() {
                this.tryUpdateSummary()
            }
        },
        'selectedWidgets': {
            handler (newV) {
                console.log('watch selectedWidgets')
                this.handleCheckedWidgets(newV)
            },
            deep: true,
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
