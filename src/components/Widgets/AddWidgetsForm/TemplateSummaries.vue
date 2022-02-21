<template>
    <div>
        <portal to="redirect-action">
          <span class="text-primary redirect-action"
                @click="goToSettings()">
                <IconDirLeft class="mx-1"/>
                {{ $t('settings.settings') }}
            </span>
        </portal>
        <portal to="form-title">
            {{ $t('widget.summary') }}
        </portal>
        <div class="-mx-4-5">
            <div
                class="pl-9 pr-7 py-4 flex items-center justify-between text-gray-550 border-b"
                v-for="(template, index) in templates"
                :key="template.TemplateName"
            >
                <div class="flex items-center">
                    <el-checkbox
                        @change="onChange($event, template)"
                        :checked="template.toStore"
                        :v-model="template.toStore"
                    />
                    <component
                        class="ml-9 mr-5 text-primary"
                        :is="getTemplateIcon(template.DataType.DataTypeID)"/>
                    <span class="truncate">
                    <div class="font-bold text-gray-950">
                        {{ template.TemplateName }}
                    </div>
                    <div class="font-medium">
                        {{ getWidgetTime(template) }}
                    </div>
                </span>
                </div>
                <div
                    class="flex items-center cursor-pointer text-primary"
                    @click="onEditTemplate(template, index)"
                >
                    <span class="mx-3 text-primary text-base">
                        {{ $t('common.edit') }}
                    </span>
                    <IconShape/>
                </div>
            </div>
        </div>
        <portal to="form-footer">
            <div class="px-10">
                <confirm-button
                    :label="$t('common.save')"
                    icon="IconSave"
                    @on-click="onChange"
                />
            </div>
        </portal>
    </div>
</template>
<script>
    import times from 'lodash/times'
    import { Checkbox } from 'element-ui'
    import cloneDeep from 'lodash/cloneDeep'
    import { getDefaultGridLayout } from '@/helpers/util'
    import { templateIcons } from '@/enum/widgetDataTypes'
    import { widgetTimeOptions } from '@/enum/widgetTimeOptions'
    import ConfirmButton from "@/components/Common/Buttons/ConfirmButton";

    export default {
        components: {
            [Checkbox.name]: Checkbox,
            ConfirmButton,
        },
        props: {
            summaryActions: String,
        },
        data() {
            return {
                templates: [],
                widgetTimeOptions
            }
        },
        computed: {
            getSummary() {
                return this.$store.getters['widgetCreation/getSummaries']
            },
            getDataToSetup() {
                return this.$store.getters['widgetCreation/getTemplatesToSetup']
            },
            getTemplatesToSetup() {
                let templates = this.getDataToSetup
                return Object.values(templates)
            }
        },
        methods: {
            onSubmit() {
                this.templates.map(el => {
                    if (el.DefaultWidgetLayout && Object.keys(el.DefaultWidgetLayout)) {
                        if (el.DefaultWidgetLayout.status && Object.keys(el.DefaultWidgetLayout.status)) {
                            el.WidgetLayout.status = el.DefaultWidgetLayout.status.value
                        }
                        if (el.DefaultWidgetLayout.statistics && Object.keys(el.DefaultWidgetLayout.statistics)) {
                            el.WidgetLayout.ShowStatistics = el.DefaultWidgetLayout.statistics.ShowStatistics
                            el.WidgetLayout.SumOfOthers = el.DefaultWidgetLayout.statistics.SumOfOthers
                            el.WidgetLayout.AbsoluteNumbers = el.DefaultWidgetLayout.statistics.AbsoluteNumbers
                        }

                        delete el.DefaultWidgetLayout
                    }
                    return el
                })
                this.$emit('on-submit', this.templates)
            },
            getTemplateIcon(templateDataTypeID) {
                return templateIcons[templateDataTypeID]
            },
            onChange(state, widget) {
                this.$set(widget, 'toStore', state)
                this.updateSummaries(state, widget)
            },
            async updateSummaries(state, widget) {
                let summaries = cloneDeep(this.getSummary)

                const tName = widget.TemplateName
                const tID = widget.TemplateID

                let summaryText = summaries.summaryText
                let summaryQuantity = summaries.quantities

                summaryText[tName] = state ? ++summaryText[tName] : --summaryText[tName]
                summaryQuantity[tID] = state ? ++summaryQuantity[tID] : --summaryQuantity[tID]

                summaries = {
                    quantities: summaryQuantity,
                    summaryText: summaryText,
                }

                await this.$store.dispatch('widgetCreation/updateSummaries', summaries)
            },
            async onEditTemplate(template, index) {
                const data = {
                    template: template,
                    index: index
                }

                await this.$store.dispatch('widgetCreation/editTemplate', data)
            },
            goToSettings() {
                this.$emit('on-go-to-settings')
            },
            composeData() {
                let templates = cloneDeep(this.getTemplatesToSetup)
                let widgetTemplatesToAdd = []
                let defaultLayout = getDefaultGridLayout()
                const allWidgetsWithQuantity = this.$store.getters['widgetCreation/getAllWidgetsWithQuantity']

                if (allWidgetsWithQuantity && allWidgetsWithQuantity.length) {
                    widgetTemplatesToAdd = allWidgetsWithQuantity
                } else {
                    templates.forEach((template) => {
                        template['WidgetLayout'] = { GridLayout: defaultLayout }
                        times(template.quantity, () => {
                            template['toStore'] = true
                            widgetTemplatesToAdd.push(cloneDeep(template))
                        })
                    })
                }
                if (!allWidgetsWithQuantity) {
                    const widgets = cloneDeep(widgetTemplatesToAdd)
                    this.$store.dispatch('widgetCreation/setWidgets', widgets)
                }

                this.templates = widgetTemplatesToAdd
            },
            getWidgetTime (template) {
                let widgetTimeOption = ''
                const defaultWidgetTime = template.DefaultWidgetTime

                if (defaultWidgetTime.type === 'absolute') {
                    widgetTimeOption = `${defaultWidgetTime.Date_start} - ${defaultWidgetTime.Date_end}`
                } else {
                    const label = this.widgetTimeOptions.find(el => el.Date_interval === defaultWidgetTime.Date_interval).label
                    widgetTimeOption = this.$t(label)
                }

                return widgetTimeOption
            }
        },
        async mounted() {
            await this.composeData()
        }
    }
</script>

<style lang="scss" scoped>
.btn-save {
    @apply text-base px-11 py-2;
}
</style>
