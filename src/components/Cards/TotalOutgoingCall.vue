<template>
    <div>
        <base-wrapper
            :cardIcon="cardIcon"
            :cardText="model.Title"
            :cardValue="cardValue"
            :layoutConfig="layoutConfig"
            :showText="showText"
            :styles="getCardStyles"
            @show-modal="onShowModal"
            v-bind="$attrs"
            v-on="$listeners"
        />
        <update-dialog
            :model="model"
            :layoutConfig="layoutConfig"
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
    import {Collapse, CollapseItem, Tooltip, Checkbox} from 'element-ui'
    import OtherFilters from '@/components/Widgets/WidgetUpdateForm/Filters/OtherFilters'
    import AutoComplete from '@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'

    export default {
        components: {
            OtherFilters,
            AutoComplete,
            UpdateDialog,
            RefreshButton,
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
            }
        },
        computed: {
            getCardStyles () {
                let widget = this.model

                let styles = {
                    color: {
                        'color': widget.colors.fonts
                    },
                    'background': widget.colors.background,
                    'max-width': `${this.data.WidgetLayout['maxWidth'] || '400'}px`,
                    'min-width': `${this.data.WidgetLayout['minWidth'] || '250'}px`,
                    'max-height': `${this.data.WidgetLayout['maxHeight'] || '300'}px`,
                    'min-height': `${this.data.WidgetLayout['minHeight'] || '100'}px`,
                    'titleFontSize':`${this.data.WidgetLayout['titleFontSize'] || '22'}px`,
                    'valueFontSize': `${this.data.WidgetLayout['valueFontSize'] || '64'}px`,
                }

                if (this.displayBorder) {
                    styles = {
                        ...styles,
                        ...{
                            'border': `2px solid ${widget.colors.frames}`,
                        }
                    }
                }
                return styles
            },
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

                let data = {
                    showText: this.displayCardText,
                    displayBorder: this.displayCardBorder,
                }

                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...data,
                    ...this.layoutConfig,
                    colors: this.model.colors
                };

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
            this.layoutConfig = {
                maxWidth: this.data.WidgetLayout['maxWidth'] || '400',
                minWidth: this.data.WidgetLayout['minWidth'] || '250',
                maxHeight: this.data.WidgetLayout['maxHeight'] || 'auto',
                minHeight: this.data.WidgetLayout['minHeight'] || '100',
                titleFontSize: this.data.WidgetLayout['titleFontSize'] || 22,
                valueFontSize: this.data.WidgetLayout['valueFontSize'] || 64,
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
