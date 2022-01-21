<template>
    <div>
        <portal to="redirect-action">
            <span class="text-steel hover:text-primary redirect-action"
                @click="allSelectedTemplates()">
                <IconDirLeft class="mx-1"/>
                {{ $t('widget.widgets') }}
            </span>
        </portal>
        <portal to="form-title">
            {{$t('widget.setUpTheGeneralSettings')}}
        </portal>
        <div class="py-4 -mx-4-5">
            <div v-for="(config, index) in uniqTemplatesConfigs"
                :key="index"
                class="py-4 px-16"
                :class="{'border-b': uniqTemplatesConfigs.length !== index + 1}">
                <AutoComplete
                    v-if="isAutoCompleteConfig(config)"
                    :key="`auto-complete-${config.ParameterID}`"
                    :model="config"
                />
                <OtherFilters
                    v-else
                    :key="`other-filters-${config.ParameterID}`"
                    :model="config"
                />
            </div>
        </div>
        <portal to="form-footer">
            <div class="px-10">
                <el-button @click="onViewSummary"
                    class="font-bold"
                    type="primary">
                    {{ $t('general.next') }}
                </el-button>
            </div>
        </portal>
    </div>
</template>
<script>
    import uniqBy from 'lodash/uniqBy'
    import orderBy from 'lodash/orderBy'
    import AutoComplete from '@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'
    import OtherFilters from '@/components/Widgets/WidgetUpdateForm/Filters/OtherFilters'
    import ENUM from '@/enum/parameters'

    export default {
        components: {
            AutoComplete,
            OtherFilters,
        },
        props: {
            templates: {
                type: Array,
                default: () => [],
            },
            summaryActions: String,
        },
        data () {
            return {
                uniqTemplatesConfigs: [],
                templateConfigs: []
            }
        },
        computed: {
            async getTemplatesToSetup() {
                return await this.$store.getters['widgetCreation/getTemplatesToSetup']
            }
        },
        async mounted () {
            await this.getTemplateConfigs()
            await this.createUniqTemplateConfigs()
        },
        methods: {
            isAutoCompleteConfig(config) {
                return config.ParameterType === ENUM.AUTO_COMPLETE_TYPE_KEY
            },
            async allSelectedTemplates() {
                await this.$store.dispatch('widgetCreation/goToCategory', 'TemplatePreview')
            },
            async onViewSummary() {
                this.templateConfigs.flat().map(temp => {
                    const uniqTemplateConfig = this.uniqTemplatesConfigs.find(uniqTemp => uniqTemp.ParameterName === temp.ParameterName)

                    if (parseInt(uniqTemplateConfig.WidgetParameterJson) === 1) {
                        temp.WidgetParameterValueJson = uniqTemplateConfig.WidgetParameterValueJson
                    } else {
                        temp.WidgetParameterValue = uniqTemplateConfig.WidgetParameterValue
                    }

                    return temp
                })
                await this.$store.dispatch('widgetCreation/copyTemplate', this.uniqTemplatesConfigs)
                await this.$store.dispatch('widgetCreation/goToSummary')
            },
            async createUniqTemplateConfigs () {
                const copyTemplates = await this.$store.getters['widgetCreation/getCopyTemplate']
                const uniqTemplates = uniqBy(this.templateConfigs.flat(), 'ParameterName')
                    .map((el, index) => {
                        if (copyTemplates && copyTemplates.length && el.ParameterName === copyTemplates[index].ParameterName) {
                            el = copyTemplates[index]
                        }

                        return el
                    })
                this.uniqTemplatesConfigs = orderBy(uniqTemplates, ['ParameterType'], ['desc'])
            },
            async getTemplateConfigs() {
                const templatesToSetup = await this.getTemplatesToSetup
                const result =  Object.values(templatesToSetup)

                this.templateConfigs = result
                    .filter(template => template.DefaultWidgetConfig)
                    .map(template => template.DefaultWidgetConfig)
            }
        }
    }
</script>
