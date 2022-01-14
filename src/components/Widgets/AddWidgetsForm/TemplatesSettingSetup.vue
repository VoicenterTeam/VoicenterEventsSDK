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
                    <span class="mx-2 font-medium text-xl text-gray-950">
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
            <div class="pt-4 pb-7 px-16" v-if="showStatusSelect">
                <div class="w-100">
                    <div class="flex items-center pt-4">
                        <div class="flex items-center pb-4">
                            <span class="mx-2 font-medium text-xl text-gray-950">
                                {{ $t('status') }}
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
    import statusTypes, { callStatuses, otherStatuses } from '@/enum/statusTypes'
    import { Option, Select } from 'element-ui'
    import { isCounterAgentsInStatus } from '@/helpers/widgetUtils'

    export default {
        components: {
            AutoComplete,
            OtherFilters,
            TimeFrame,
            [Option.name]: Option,
            [Select.name]: Select,
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
                widgetTimeOptions,
                selectedStatus: '',
                selectedIcon: '',
                selectedOption: {},
                showStatusSelect: false
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
            await this.getTemplateConfigs()
            await this.createUniqTemplateConfigs()
            await this.$store.dispatch('widgetCreation/resetWidgets')
            await this.settingDefaultValueInStatus()
            await this.setShowSelectStatus()
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
                    if (this.selectedOption && Object.keys(this.selectedOption).length) {
                        el.DefaultWidgetLayout = {
                            status: this.selectedOption
                        }
                    }

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
            },
            async setShowSelectStatus () {
                const templatesToSetup = await this.getTemplatesToSetup
                const allTemplatesToSetup = Object.values(templatesToSetup)
                this.showStatusSelect = allTemplatesToSetup.some(el => isCounterAgentsInStatus(el.DataType))
            },
            async settingDefaultValueInStatus () {
                const templatesToSetup = await this.getTemplatesToSetup
                Object.values(templatesToSetup)
                    .forEach(el => {
                        if (el.DefaultWidgetLayout && Object.keys(el.DefaultWidgetLayout)) {
                            const value = el.DefaultWidgetLayout.status.value
                            this.onStatusChange(value)
                        } else {
                            this.onStatusChange(this.statuses[0].value)
                        }
                    })
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
.select ::v-deep input::placeholder {
    @apply text-gray-500 font-normal text-sm;
}
.select, .select ::v-deep .el-select > .el-input {
    @apply w-100;
}
.select-status .el-input__inner {
    @apply pl-9;
}
</style>
