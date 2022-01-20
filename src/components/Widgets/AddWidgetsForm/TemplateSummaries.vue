<template>
    <div>
        <portal to="redirect-action">
          <span class="text-steel hover:text-primary redirect-action"
                @click="goToSettings()">
                <IconDirLeft class="mx-1"/>
                {{ $t('Settings') }}
            </span>
        </portal>
        <portal to="form-title">
            {{ $t('Summary') }}
        </portal>
        <div class="-mx-4-5">
            <div
                class="px-6 py-2 flex items-center justify-between text-gray-550"
                v-for="template in templates"
                :key="template.TemplateName"
            >
                <div class="flex items-center">
                    <el-checkbox @change="onChange($event, template)"
                                 :checked="template.toStore"
                                 :v-model="template.toStore"/>
                    <component class="mx-2 text-primary"
                               :is="getTemplateIcon(template.DataType.DataTypeID)"/>
                    <span class="truncate">
                    {{ template.TemplateName }}
                </span>
                </div>
                <div class="flex items-center cursor-pointer hover:text-primary"
                     @click="onEditTemplate(template)">
                <span class="mx-1">
                    {{ $t('common.edit') }}
                </span>
                    <IconShape/>
                </div>
            </div>
        </div>
        <portal to="form-footer">
            <div class="px-10">
                <el-button @click="onSubmit"
                           class="font-bold"
                           type="primary">
                    {{ $t('Save') }}
                </el-button>
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
    
    export default {
        components: {
            [Checkbox.name]: Checkbox,
        },
        props: {
            summaryActions: String,
        },
        data() {
            return {
                templates: [],
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
            },
        },
        methods: {
            onSubmit() {
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
            async onEditTemplate(template) {
                await this.$store.dispatch('widgetCreation/editTemplate', template)
            },
            goToSettings() {
                this.$emit('on-go-to-settings')
            },
            composeData() {
                const templates = this.getTemplatesToSetup
                let widgetTemplatesToAdd = []
                let defaultLayout = getDefaultGridLayout()
                
                templates.forEach((template) => {
                    template['WidgetLayout'] = { GridLayout: defaultLayout }
                    return times(template.quantity, () => {
                        template['toStore'] = true
                        widgetTemplatesToAdd.push(template)
                    })
                })
                this.templates = widgetTemplatesToAdd
            }
        },
        async mounted() {
            await this.composeData()
        }
    }
</script>
