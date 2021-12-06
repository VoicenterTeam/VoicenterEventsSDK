<template>
    <div>
        <portal to="redirect-action">
            <span class="text-steel hover:text-primary redirect-action"
                @click="allSelectedTemplates()">
                <IconDirLeft class="mx-1"/>
                {{ $t('Widgets') }}
            </span>
        </portal>
        <portal to="form-title">
            {{$t('Set up the general widgets settings')}}
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
                    {{ $t('Next') }}
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

    const AUTO_COMPLETE_TYPE_KEY = 6

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
            getTemplatesToSetup() {
                return this.$store.getters['widgetCreation/getTemplatesToSetup']
            }
            // getTemplateConfigs() {
            //     const templatesToSetup = this.getTemplatesToSetup
            //     const result = Object.values(templatesToSetup)
            //     return result.map(template => template.DefaultWidgetConfig)
            // }
            // templateConfigs() {
            //     const editMode = this.$store.getters['widgetCreation/getTemplateToEdit']
            //     let templates = []

            //     if (editMode && Object.keys(editMode).length) {
            //         templates = orderBy(editMode.DefaultWidgetConfig, ['ParameterType'], ['desc'])
            //     } else {
            //         const uniqTemplates = uniqBy(this.getTemplateConfigs.flat(), 'ParameterName')
            //         templates = orderBy(uniqTemplates, ['ParameterType'], ['desc'])
            //     }

            //     return templates
            // },
        },
        async mounted () {
            await this.getTemplateConfigs()
            await this.createUniqTemplateConfigs()
        },
        // watch: {
        //     uniqTemplatesConfigs: {
        //         handler (val) {
        //             console.log('q')
        //             const allParameterName = val.map(el => el.ParameterName)
        //             this.templateConfigs.map(temp => {
        //                 temp.map(el => {
        //                     if (allParameterName.indexOf(el.ParameterName) !== -1) {
        //                         const sameObj = val.find(q => q.ParameterName === el.ParameterName)

        //                         el.WidgetParameterValue = sameObj.WidgetParameterValue
        //                         el.WidgetParameterValueJson = sameObj.WidgetParameterValueJson
        //                     }
        //                     return el
        //                 })
        //                 return temp
        //             })
        //         },
        //         deep: true
        //     }
        // },
        methods: {
            isAutoCompleteConfig(config) {
                return config.ParameterType === AUTO_COMPLETE_TYPE_KEY
            },
            async allSelectedTemplates() {
                // await this.$store.dispatch('widgetCreation/goToCategory', 'TemplatePreview')
                await this.$store.dispatch('widgetCreation/goToSummary')
            },
            async onViewSummary() {
                const editMode = this.$store.getters['widgetCreation/getTemplateToEdit']
                if (!editMode) {
                    const allParameterName = this.uniqTemplatesConfigs.map(el => el.ParameterName)
                    this.templateConfigs.map(temp => {
                        temp.map(el => {
                            if (allParameterName.indexOf(el.ParameterName) !== -1) {
                                const sameObj = this.uniqTemplatesConfigs.find(q => q.ParameterName === el.ParameterName)

                                el.WidgetParameterValue = sameObj.WidgetParameterValue
                                el.WidgetParameterValueJson = sameObj.WidgetParameterValueJson
                            }
                            return el
                        })
                        return temp
                    })
                }
                console.log(editMode, 'editMode')
                // if (editMode && Object.keys(editMode).length) {
                //     templates = orderBy(editMode.DefaultWidgetConfig, ['ParameterType'], ['desc'])
                // }
                // const allParameterName = this.uniqTemplatesConfigs.map(el => el.ParameterName)
                // this.templateConfigs.map(temp => {
                //     temp.map(el => {
                //         if (allParameterName.indexOf(el.ParameterName) !== -1) {
                //             const sameObj = this.uniqTemplatesConfigs.find(q => q.ParameterName === el.ParameterName)

                //             el.WidgetParameterValue = sameObj.WidgetParameterValue
                //             el.WidgetParameterValueJson = sameObj.WidgetParameterValueJson
                //         }
                //         return el
                //     })
                //     return temp
                // })
                await this.$store.dispatch('widgetCreation/goToSummary')
            },
            async createUniqTemplateConfigs () {
                const editMode = this.$store.getters['widgetCreation/getTemplateToEdit']
                let templates = []
                console.warn(editMode, 'editMode')

                if (editMode && Object.keys(editMode).length) {
                    templates = orderBy(editMode.DefaultWidgetConfig, ['ParameterType'], ['desc'])
                } else {
                    const uniqTemplates = uniqBy(this.templateConfigs.flat(), 'ParameterName')
                    templates = orderBy(uniqTemplates, ['ParameterType'], ['desc'])
                }

                this.uniqTemplatesConfigs = templates

                // return templates
            },
            async getTemplateConfigs() {
                const templatesToSetup = this.getTemplatesToSetup
                const result = Object.values(templatesToSetup)

                this.templateConfigs = result.map(template => template.DefaultWidgetConfig)
                // return result.map(template => template.DefaultWidgetConfig)
            }
        }
    }
</script>
