<template>
    <div>
        <portal to="redirect-action">
            <span class="text-primary redirect-action"
                @click="allSelectedTemplates()">
                <IconDirLeft class="mx-1"/>
                {{ $t('Widgets') }}
            </span>
        </portal>
        <portal to="form-title">
            {{$t('Set up the general widgets settings')}}
        </portal>
        <div class="py-4 -mx-4-5">
            <div class="pt-4 pb-7 px-16 border-b">
                <div class="flex items-center pb-4">
                    <i class="vc-icon-timer text-primary mx-w-4-5 text-xl" />
                    <span class="mx-2 font-bold text-xl text-gray-950">
                        {{ $t('timeFrame') }}
                    </span>
                </div>
                <time-frame
                    v-if="widgetTime && Object.keys(widgetTime).length"
                    :model="widgetTime"
                    :timeFrameType="widgetTime.WidgetTime.type"
                    :widgetTimeOptions="widgetTimeOptions"
                    :isCollapse="false"
                >
                    <template v-slot:frame-types>
                        <BaseRadioGroup
                            v-model="widgetTime.WidgetTime.type"
                            :radios="createWidgetTimeTypes"
                            class="radio-groups mb-5"
                        />
                    </template>
                </time-frame>
            </div>
            <div v-for="(config, index) in uniqTemplatesConfigs"
                :key="index"
                class="py-4 px-16"
            >
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
                    class="font-bold btn-next"
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
    import ENUM from '@/enum/parameters'
    import { widgetTimeOptions, widgetTimeTypes } from '@/enum/widgetTimeOptions'
    import TimeFrame from '@/components/Widgets/WidgetUpdateForm/WidgetTime/TimeFrame'

    export default {
        components: {
            AutoComplete,
            OtherFilters,
            TimeFrame
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
                templateConfigs: [],
                widgetTime: [],
                widgetTimeTypes,
                widgetTimeOptions
            }
        },
        computed: {
            async getTemplatesToSetup() {
                return await this.$store.getters['widgetCreation/getTemplatesToSetup']
            },
            createWidgetTimeTypes () {
                return this.widgetTimeTypes
                    .map(el => {
                        return {
                            label: el.text, value: el.label
                        }
                    })
            }
        },
        async mounted () {
            await this.getTemplateConfigs()
            await this.createUniqTemplateConfigs()
            this.$store.dispatch('widgetCreation/resetWidgets')
        },
        methods: {
            isAutoCompleteConfig(config) {
                return config.ParameterType === ENUM.AUTO_COMPLETE_TYPE_KEY
            },
            async allSelectedTemplates() {
                await this.$store.dispatch('widgetCreation/resetCopyTemplate')
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
                const templatesToSetup = await this.getTemplatesToSetup
                const result =  Object.values(templatesToSetup)
                result.map(el => {
                    el.DefaultWidgetTime = this.widgetTime.WidgetTime

                    return el
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
                const widgetTime = result
                    .filter(template => template.DefaultWidgetTime)
                    .map(template => template.DefaultWidgetTime)

                this.widgetTime = {
                    WidgetTime: uniqBy(widgetTime, 'DefaultWidgetTime')[0]
                }

                this.templateConfigs = result
                    .filter(template => template.DefaultWidgetConfig)
                    .map(template => template.DefaultWidgetConfig)
            }
        }
    }
</script>

<style lang="scss">
.radio-groups {
    @apply flex;
}
.radio-groups .vc-form-radio:last-child {
    @apply ml-8;
}
.btn-next {
    @apply text-base px-11 py-2;
}
</style>
