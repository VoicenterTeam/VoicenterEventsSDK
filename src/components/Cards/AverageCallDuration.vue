<template>
    <div>
        <base-wrapper
            :cardText="getCounterTypeKey"
            :cardValue="cardValue"
            :cardIcon="getCardIcon"
            :layoutConfig="layoutConfig"
            :showText="showText"
            :styles="getCardStyles"
            @show-modal="onShowModal"
            v-bind="$attrs"
            v-on="$listeners"
            :widget="data"
        />
        <update-dialog
            :layoutConfig="layoutConfig"
            :model="model"
            :visible.sync="showModal"
            @on-change="onChange"
            v-if="showModal">
            <template v-slot:content>
                <el-form @submit.native.prevent="onChange">
                    <el-form-item>
                        <div class="flex flex-col">
                            <label>{{ $t('widget.countersToDisplay') }}</label>
                            <base-select
                                :multiple="false"
                                :data="availableCounters"
                                v-model="model.WidgetLayout.showCounter"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="py-2 flex">
                            <el-checkbox v-model="displayCardText">
                                {{ $t('status.show.text') }}
                            </el-checkbox>
                            <el-checkbox class="px-4" v-model="displayCardBorder">
                                {{ $t('status.display.border') }}
                            </el-checkbox>
                        </div>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:additional-data>
                <time-frame
                    :model="model"
                    :timeFrameType="model.WidgetTime.type"
                    :widgetTimeOptions="widgetTimeOptions"
                    v-if="model && model.WidgetTime">
                    <template v-slot:frame-types>
                        <BaseRadioGroup
                            v-model="model.WidgetTime.type"
                            :radios="createWidgetTimeTypes"
                            class="radio-groups mb-5"
                        />
                    </template>
                </time-frame>
                <div class="flex items-center justify-between text-main-base" v-if="autoCompletes.length">
                    {{ $t('tooltip.refresh.entities.list') }}
                    <RefreshButton
                        :disabled="loadEntitiesList"
                        :loading="loadEntitiesList"
                        @click.native="refreshEntitiesList"/>
                </div>
                <el-collapse class="pt-4" v-if="autoCompletes.length" v-model="activeCollapse">
                    <el-collapse-item :title="$t('settings.filters')" name="filters">
                        <auto-complete
                            :key="index"
                            :model="model.WidgetConfig[index]"
                            v-for="(filter, index) in model.WidgetConfig"
                            v-if="isAutoComplete(filter)"/>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse class="pt-4" v-if="otherFilters.length" v-model="activeCollapse">
                    <el-collapse-item :title="$t('settings.other.filters')" name="otherFilters">
                        <other-filters
                            :key="index"
                            :model="model.WidgetConfig[index]"
                            v-for="(filter, index) in model.WidgetConfig"
                            v-if="isOtherFilters(filter)"/>
                    </el-collapse-item>
                </el-collapse>
            </template>
            <template v-slot:footer>
                <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                    <cancel-button
                        @on-click="showModal = false"
                    />
                    <confirm-button
                        :label="$t('common.save')"
                        icon="IconSave"
                        @on-click="onChange"
                    />
                </div>
            </template>
        </update-dialog>
    </div>
</template>
<script>

    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import cardWidgetMixin from '@/mixins/cardWidgetMixin'
    import { availableCounters } from '@/enum/queueCounters'
    import { getWidgetData } from '@/services/widgetService'
    import { defaultCardColors } from '@/enum/defaultWidgetSettings'
    import { widgetTimeOptions, widgetTimeTypes } from '@/enum/widgetTimeOptions'
    import { Checkbox, Collapse, CollapseItem, Option, Select, Tooltip } from 'element-ui'
    import CancelButton from "@/components/Common/Buttons/CancelButton"
    import ConfirmButton from "@/components/Common/Buttons/ConfirmButton"

    export default {
        mixins: [cardWidgetMixin],
        components: {
            TimeFrame: () => import('@/components/Widgets/WidgetUpdateForm/WidgetTime/TimeFrame'),
            OtherFilters: () => import('@/components/Widgets/WidgetUpdateForm/Filters/OtherFilters'),
            AutoComplete: () => import('@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'),
            UpdateDialog: () => import('./UpdateDialog'),
            RefreshButton: () => import('@/components/RefreshButton'),
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [Select.name]: Select,
            [Option.name]: Option,
            CancelButton,
            ConfirmButton,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            showText: {
                type: Boolean,
                default: true,
            },
            displayBorder: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                fetchDataInterval: null,
                cardValue: '0:00:00',
                showModal: false,
                layoutConfig: {},
                displayCardText: this.showText,
                displayCardBorder: this.displayBorder,
                model: {},
                AUTO_COMPLETE_PARAMETER_TYPE: 6,
                loadEntitiesList: false,
                activeCollapse: 'filters',
                widgetTimeTypes,
                widgetTimeOptions,
                availableCounters,
                icons: {
                    'Average duration of incoming calls': 'IconAverageIncomingCalls',
                    'Average duration of outgoing calls': 'IconAverageOutgoingCalls',
                    'Average duration of all calls': 'IconAverageAllCalls',
                },
            }
        },
        computed: {
            autoCompletes() {
                return this.data.WidgetConfig.filter(c => c.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE)
            },
            otherFilters() {
                return this.data.WidgetConfig.filter(c => c.ParameterType && c.ParameterType !== this.AUTO_COMPLETE_PARAMETER_TYPE)
            },
            getCounterTypeKey() {
                return get(this.data.WidgetLayout, 'showCounter', 'Average duration of all calls')
            },
            getCardIcon() {
                return this.icons[this.getCounterTypeKey]
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
        methods: {
            async getWidgetData() {
                try {
                    const data = await getWidgetData(this.data)
                    this.cardValue = get(data, `[0][${this.getCounterTypeKey}]`, '0:00:00')
                } catch (e) {
                    console.log(e)
                }
            },
            onShowModal() {
                this.showModal = true
            },
            onChange() {
                try {
                    this.model.WidgetConfig.forEach((config) => {
                        if (typeof config.WidgetParameterJson === 1) {
                            config.WidgetParameterValueJson['AccountList'] = [this.$store.state.entities.selectedAccountID]
                        }
                        if (typeof config.WidgetParameterValue === 'object') {
                            config.WidgetParameterValue['AccountList'] = [this.$store.state.entities.selectedAccountID]
                            config.WidgetParameterValue = JSON.stringify(config.WidgetParameterValue)
                        }
                    })
                } catch (e) {
                }

                if (this.model.WidgetTime.type === 'relative') {
                    let widgetTime = widgetTimeOptions.find((el) => el.Date_interval === this.model.WidgetTime.Date_interval)
                    this.model.WidgetTime = {
                        ...this.model.WidgetTime,
                        ...widgetTime,
                    }
                }

                let data = {
                    showText: this.displayCardText,
                    displayBorder: this.displayCardBorder,
                }

                this.data.WidgetLayout = {
                    ...this.model.WidgetLayout,
                    ...data,
                    ...this.layoutConfig,
                    colors: this.model.colors,

                }

                this.data.WidgetTime = this.model.WidgetTime
                this.data.WidgetConfig = this.model.WidgetConfig

                this.$emit('on-update', this.data)
                this.showModal = false
            },
            async refreshEntitiesList() {
                this.loadEntitiesList = true
                await this.$store.dispatch('entities/getEntitiesList')
                this.loadEntitiesList = false
            },
            isAutoComplete(WidgetConfig) {
                return WidgetConfig.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE
            },
            isOtherFilters(WidgetConfig) {
                return WidgetConfig.ParameterType !== this.AUTO_COMPLETE_PARAMETER_TYPE
            },
            setDefaultCounterType() {
                if (!this.model.WidgetLayout.hasOwnProperty('showCounter')) {
                    this.$set(this.model.WidgetLayout, 'showCounter', 'Average duration of all calls')
                }
            },
            getWidgetDataWithRefreshInterval () {
                if (this.fetchDataInterval) {
                    clearInterval(this.fetchDataInterval)
                }
                if (this.data.DefaultRefreshInterval) {
                    this.fetchDataInterval = setInterval(async() => {
                        await this.getWidgetData()
                    }, this.data.DefaultRefreshInterval)
                }
            }
        },
        mounted() {
            this.getWidgetData()
            this.setDefaultCounterType()
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.getWidgetDataWithRefreshInterval()
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultCardColors)
                    this.setDefaultCounterType()
                },
            },
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>

<style lang="scss" scoped>
::v-deep .el-select {
    @apply w-full;
}
</style>
