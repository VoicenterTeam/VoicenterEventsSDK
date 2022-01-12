<template>
    <div>
        <portal to="redirect-action">
            <span class="text-primary redirect-action"
                @click="goToSummary()">
                <IconDirLeft class="mx-1"/>
                {{ $t('Summary') }}
            </span>
        </portal>
        <portal to="form-title">
            {{$t('Set up the widget settings')}}
        </portal>
        <div class="py-4 -mx-4-5">
            <div class="pt-4 pb-7 px-16">
                <div class="w-70">
                    <div class="flex mb-2">
                        <IconDirLeft class="mx-w-4-5 h-4-5 text-primary mr-2" /> <!--TODO: change to vc-icon -->
                        <label class="font-medium text-gray-950">{{ $t('widget.title') }}</label>
                    </div>
                    <el-input
                        v-model="widgetName"
                    />
                </div>
            </div>
            <div class="pt-4 pb-7 px-16 border-b">
                <div class="flex items-center pb-4">
                    <IconDirLeft class="mx-w-4-5 h-4-5 text-primary" />
                    <span class="mx-2 font-medium text-xl text-gray-950">
                        {{ $t('timeFrame') }}
                    </span>
                </div>
                <time-frame
                    v-if="widgetTimeConfig && Object.keys(widgetTimeConfig).length"
                    :model="widgetTimeConfig"
                    :timeFrameType="widgetTimeConfig.WidgetTime.type"
                    :widgetTimeOptions="widgetTimeOptions"
                    :isCollapse="false"
                >
                    <template v-slot:frame-types>
                        <BaseRadioGroup
                            v-model="widgetTimeConfig.WidgetTime.type"
                            :radios="createWidgetTimeTypes"
                            class="radio-groups mb-5"
                        />
                    </template>
                </time-frame>
            </div>
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
    import orderBy from 'lodash/orderBy'
    import AutoComplete from '@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'
    import OtherFilters from '@/components/Widgets/WidgetUpdateForm/Filters/OtherFilters'
    import cloneDeep from 'lodash/cloneDeep'
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
                widgetTimeConfig: {},
                widgetTimeTypes,
                widgetTimeOptions,
                widgetName: '',
                editIndex: null
            }
        },
        computed: {
            getTemplateToEdit() {
                return this.$store.getters['widgetCreation/getTemplateToEdit']
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
            await this.createUniqTemplateConfigs()
        },
        methods: {
            isAutoCompleteConfig(config) {
                return config.ParameterType === ENUM.AUTO_COMPLETE_TYPE_KEY
            },
            async goToSummary() {
                const data = {
                    template: this.uniqTemplatesConfigs,
                    templateID: this.getTemplateToEdit.template.TemplateID,
                    widgetTime: this.widgetTimeConfig.WidgetTime,
                    widgetName: this.widgetName,
                    index: this.editIndex
                }

                await this.$store.dispatch('widgetCreation/updateWidget', data)
                await this.$store.dispatch('widgetCreation/goToSummary')
            },
            async onViewSummary() {
                await this.goToSummary()
            },
            async createUniqTemplateConfigs () {
                const templateToEdit = cloneDeep(this.getTemplateToEdit.template)
                this.editIndex = this.getTemplateToEdit.index
                let templates = []

                if (templateToEdit && Object.keys(templateToEdit).length) {
                    templates = orderBy(templateToEdit.DefaultWidgetConfig, ['ParameterType'], ['desc'])
                }

                this.uniqTemplatesConfigs = templates
                this.widgetTimeConfig = {
                    WidgetTime: {
                        ...templateToEdit.DefaultWidgetTime
                    }
                }
                this.widgetName = templateToEdit.TemplateName
            }
        }
    }
</script>
