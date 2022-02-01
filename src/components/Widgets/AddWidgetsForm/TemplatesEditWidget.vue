<template>
    <div>
        <portal to="redirect-action">
            <span class="text-primary redirect-action"
                @click="goToSummary()">
                <IconDirLeft class="mx-1"/>
                {{ $t('widget.summary') }}
            </span>
        </portal>
        <portal to="form-title">
            {{$t('widget.setUpTheWidgetSettings')}}
        </portal>
        <div class="py-4 -mx-4-5">
            <div class="pt-4 pb-7 px-16">
                <div class="w-70">
                    <div class="flex mb-2">
                        <i class="vc-icon-name text-primary mx-w-4-5 text-xl mr-2" />
                        <label class="font-medium text-gray-950">{{ $t('widget.title') }}</label>
                    </div>
                    <el-input
                        v-model="widgetName"
                    />
                </div>
            </div>
            <div class="pt-4 pb-7 px-16 border-b">
                <div class="flex items-center pb-4">
                    <i class="vc-icon-timer text-primary mx-w-4-5 text-xl" />
                    <span class="mx-2 font-medium text-xl text-gray-950">
                        {{ $t('settings.time.frame') }}
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
            <div class="pt-4 pb-7 px-16" v-if="showStatisticsToDisplay">
                <div class="flex items-center pt-4">
                    <div class="flex items-center pb-4">
                        <span class="mx-2 font-medium text-xl text-gray-950">
                            {{ $t('statistics.to.display') }}
                        </span>
                    </div>
                </div>
                <base-select
                    :data="statistics"
                    v-model="ShowStatistics"
                    valueKey="key"
                    class="select-statistics"
                />
                <div class="flex mt-3">
                    <el-checkbox v-model="SumOfOthers">
                        <span class="text-gray-950">
                            {{ $t('widget.displayPercentOfOthersValue') }}
                        </span>
                    </el-checkbox>
                    <el-checkbox v-model="AbsoluteNumbers">
                        <span class="text-gray-950">
                            {{ $t('widget.displayAbsoluteNumbers') }}
                        </span>
                    </el-checkbox>
                </div>
            </div>
            <div class="pt-4 pb-7 px-16" v-if="showStatusSelect">
                <div class="w-100">
                    <div class="flex items-center pt-4">
                        <div class="flex items-center pb-4">
                            <span class="mx-2 font-medium text-xl text-gray-950">
                                {{ $t('general.status') }}
                            </span>
                        </div>
                    </div>
                    <el-select
                        :placeholder="$t('common.selectStatus')"
                        @change="onStatusChange"
                        class="w-full select select-status"
                        :label="`${selectedStatus}`"
                        v-model="selectedStatus">
                        <el-option
                            v-for="option in statuses"
                            :key="option.value"
                            :label="$t(option.text)"
                            v-bind="option"
                        >
                            <div class="flex">
                                <component :is="option.icon" class="w-5 mx-1 text-primary" />
                                <span class="w-16 mx-1">{{ $t(option.text) }}</span>
                            </div>
                        </el-option>
                        <template #prefix>
                            <component :is="selectedIcon" class="w-5 mx-1 pt-2 text-primary" />
                        </template>
                    </el-select>
                </div>
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
                    {{ $t('general.next') }}
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
    import statusTypes, { callStatuses, otherStatuses } from '@/enum/statusTypes'
    import { Option, Select, Checkbox } from 'element-ui'
    import { isCounterAgentsInStatus, isQueueDashboardWidget } from '@/helpers/widgetUtils'
    import { statistics } from '@/enum/queueDashboardStatistics'

    export default {
        components: {
            AutoComplete,
            OtherFilters,
            TimeFrame,
            [Option.name]: Option,
            [Select.name]: Select,
            [Checkbox.name]: Checkbox
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
                editIndex: null,
                selectedStatus: '',
                selectedIcon: '',
                selectedOption: {},
                showStatusSelect: false,
                statistics,
                ShowStatistics: [],
                SumOfOthers: false,
                AbsoluteNumbers: false,
                showStatisticsToDisplay: false
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
            },
            statuses() {
                const storeStatuses = this.$store.getters['entities/accountStatuses']
                let localStatuses = Object.values(statusTypes)
                let finalStatuses = []
                
                if (storeStatuses.length) {
                    finalStatuses = this.getStoreStatuses()
                } else {
                    finalStatuses = localStatuses.map(status => {
                        const statusText = this.$store.getters['entities/getStatusTextById'](status.value)
                        return {
                            ...status,
                            text: statusText,
                        }
                    })
                }
                
                finalStatuses.push(statusTypes[callStatuses.CALLING])
                finalStatuses.push(statusTypes[callStatuses.HOLD])
                finalStatuses.push(statusTypes[otherStatuses.AT_WORK])
                
                return finalStatuses
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

                if (this.selectedOption && Object.keys(this.selectedOption).length) {
                    data.defaultWidgetLayout = {
                        status: this.selectedOption
                    }
                }
                if (this.ShowStatistics && this.ShowStatistics.length) {
                    data.defaultWidgetLayout = {
                        statistics: {
                            ShowStatistics: this.ShowStatistics,
                            SumOfOthers: this.SumOfOthers,
                            AbsoluteNumbers: this.AbsoluteNumbers
                        }
                    }
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

                const templateToEditWithDataType = [templateToEdit]
                this.showStatusSelect = templateToEditWithDataType.some(el => isCounterAgentsInStatus(el.DataType))
                this.showStatisticsToDisplay = templateToEditWithDataType.some(el => isQueueDashboardWidget(el))

                if (this.getTemplateToEdit.template && Object.keys(this.getTemplateToEdit.template).length && 'DefaultWidgetLayout' in this.getTemplateToEdit.template) {
                    if (this.showStatusSelect) {
                        this.onStatusChange(this.getTemplateToEdit.template.DefaultWidgetLayout.status.value)
                    }

                    if (this.showStatisticsToDisplay) {
                        this.ShowStatistics = this.getTemplateToEdit.template.DefaultWidgetLayout.statistics.ShowStatistics
                        this.SumOfOthers = this.getTemplateToEdit.template.DefaultWidgetLayout.statistics.SumOfOthers
                        this.AbsoluteNumbers = this.getTemplateToEdit.template.DefaultWidgetLayout.statistics.AbsoluteNumbers
                    }
                }
            },
            onStatusChange(value) {
                let option = statusTypes[value];
                this.selectedOption = option;
                this.selectedStatus = option.value;
                this.selectedIcon = option.icon;
            },
            getStoreStatuses() {
                const storeStatuses = this.$store.getters['entities/accountStatuses']
                let localStatuses = Object.values(statusTypes)
                return storeStatuses.map(status => {
                    const otherData = localStatuses.find(s => s.value === status.StatusID) || {}
                    if (otherData) {
                        otherData['text'] = this.$store.getters['entities/getStatusTextById'](otherData.value)
                    }
                    return {
                        ...status,
                        ...otherData,
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
.select-status .el-input__inner {
    @apply pl-9;
}
.select-statistics .el-select .el-input__inner {
    @apply w-100;
}
</style>
