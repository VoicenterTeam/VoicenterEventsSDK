<template>
    <div>
        <base-wrapper
            :cardIcon="cardIcon"
            :cardText="data.Title"
            :cardValue="cardValue"
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
                        <div class="-mt-4 mb-2">
                            <label>{{$t('widget.title')}}</label>
                            <el-input v-model="model.Title"/>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="py-2 flex">
                            <el-checkbox v-model="displayCardText">
                                {{$t('status.show.text')}}
                            </el-checkbox>
                            <el-checkbox class="px-4" v-model="displayCardBorder">
                                {{$t('status.display.border')}}
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
                        <el-radio-group class="pb-4" v-model="model.WidgetTime.type">
                            <el-radio :key="widgetTimeType.text" v-bind="widgetTimeType"
                                      v-for="widgetTimeType in widgetTimeTypes">
                                {{$t(widgetTimeType.text)}}
                            </el-radio>
                        </el-radio-group>
                    </template>
                </time-frame>
                <div class="flex items-center justify-between text-main-base" v-if="autoCompletes.length">
                    {{$t('tooltip.refresh.entities.list')}}
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
                <el-button @click="showModal = false">{{$t('common.cancel')}}</el-button>
                <el-button @click="onChange" type="primary">{{$t('common.save')}}</el-button>
            </template>
        </update-dialog>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import UpdateDialog from './UpdateDialog'
    import RefreshButton from '@/components/RefreshButton'
    import {getWidgetData} from '@/services/widgetService'
    import {defaultCardColors} from '@/enum/defaultWidgetSettings'
    import {Checkbox, Collapse, CollapseItem, Radio, RadioGroup, Tooltip} from 'element-ui'
    import {widgetTimeOptions, widgetTimeTypes} from '@/enum/widgetTimeOptions'
    import OtherFilters from '@/components/Widgets/WidgetUpdateForm/Filters/OtherFilters'
    import AutoComplete from '@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'
    import cardWidgetMixin from '@/mixins/cardWidgetMixin'
    import TimeFrame from "@/components/Widgets/WidgetUpdateForm/WidgetTime/TimeFrame";

    export default {
        mixins: [cardWidgetMixin],
        components: {
            TimeFrame,
            OtherFilters,
            AutoComplete,
            UpdateDialog,
            RefreshButton,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            showText: {
                type: Boolean,
                default: true
            },
            displayBorder: {
                type: Boolean,
                default: true
            },
            cardIcon: {
                type: String,
                default: 'IconTotalOutgoingCalls'
            },
        },
        data () {
            return {
                fetchDataInterval: null,
                cardValue: null,
                DATA_KEY: 'Total Outgoing Calls',
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
            }
        },
        computed: {
            autoCompletes () {
                return this.data.WidgetConfig.filter(c => c.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE)
            },
            otherFilters () {
                return this.data.WidgetConfig.filter(c => c.ParameterType && c.ParameterType !== this.AUTO_COMPLETE_PARAMETER_TYPE)
            },
        },
        methods: {
            get,
            async getWidgetData () {
                try {
                    let Data = await getWidgetData(this.data)
                    this.cardValue = get(Data, `[0][${this.DATA_KEY}]`)
                } catch (e) {
                    console.log(e)
                }
            },
            onShowModal () {
                this.showModal = true
            },
            onChange () {
                try {
                    this.model.WidgetConfig.forEach((config) => {
                        if (typeof config.WidgetParameterValueJson === 'object') {
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
                        ...widgetTime
                    }
                }

                let data = {
                    showText: this.displayCardText,
                    displayBorder: this.displayCardBorder,
                }

                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...data,
                    ...this.layoutConfig,
                    colors: this.model.colors,

                };

                this.data.WidgetTime = this.model.WidgetTime
                this.data.WidgetConfig = this.model.WidgetConfig
                this.data.Title = this.model.Title

                this.$emit('on-update', this.data);
                this.showModal = false;
            },
            async refreshEntitiesList () {
                this.loadEntitiesList = true
                await this.$store.dispatch('entities/getEntitiesList')
                this.loadEntitiesList = false
            },
            isAutoComplete (WidgetConfig) {
                return WidgetConfig.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE
            },
            isOtherFilters (WidgetConfig) {
                return WidgetConfig.ParameterType !== this.AUTO_COMPLETE_PARAMETER_TYPE
            },
        },
        mounted () {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.getWidgetData()
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultCardColors)
                }
            }
        },
        beforeDestroy () {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
