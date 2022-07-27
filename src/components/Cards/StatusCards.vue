<template>
    <div>
        <base-wrapper
            :cardIcon="cardIcon"
            :cardText="cardText"
            :cardValue="cardValue"
            :layoutConfig="layoutConfig"
            :showText="showStatusText"
            :styles="getCardStyles"
            :widget="data"
            @show-modal="onShowModal"
            v-bind="$attrs"
            v-on="$listeners"
            usedDynamicStatuses
            :status="status"
        />
        <update-dialog
            :layoutConfig="layoutConfig"
            :model="model"
            :visible.sync="showModal"
            @on-change="onChange"
            v-if="showModal">
            <template v-slot:header>
                <div class="flex items-center pt-4" :style="styleForStatusIconColor(selectedStatus)">
                    <component :is="selectedIcon" class="w-8 mx-1"/>
                    <p class="text-main-lg font-semibold text-gray-700" slot="title">{{ $t(selectedOption.text) }}</p>
                </div>
            </template>
            <template v-slot:content>
                <el-select
                    :placeholder="$t('common.selectStatus')"
                    @change="onStatusChange"
                    class="w-full"
                    label="select"
                    v-model="selectedStatus">
                    <el-option
                        :key="option.value"
                        :label="$t(option.text)"
                        v-bind="option"
                        v-for="option in statuses">
                        <div class="flex" :style="styleForStatusIconColor(option)">
                            <component :is="option.icon" class="w-5 mx-1 text-primary"/>
                            <span class="w-16 mx-1">{{ $t(option.text) }}</span>
                        </div>
                    </el-option>
                </el-select>
                <div class="py-4 flex">
                    <el-checkbox v-model="showStatusText">
                        {{ $t('status.show.text') }}
                    </el-checkbox>
                    <el-checkbox class="px-4" v-model="displayItemBorder">
                        {{ $t('status.display.border') }}
                    </el-checkbox>
                </div>
            </template>
            <template v-slot:additional-data>
                <el-collapse class="pt-4" v-if="autoCompletes.length" v-model="activeCollapse">
                    <el-collapse-item :title="$t('settings.filters')" name="filters">
                        <auto-complete
                            :key="index"
                            :model="model.WidgetConfig[index]"
                            v-for="(filter, index) in model.WidgetConfig"
                            v-if="isAutoComplete(filter)"/>
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
    import extensionMixin from '@/mixins/extensionMixin'
    import { LOGOUT_STATUS } from '@/enum/extensionStatuses'
    import { defaultCardColors } from '@/enum/defaultWidgetSettings'
    import { Checkbox, Collapse, CollapseItem, Option, Select, Tooltip } from 'element-ui'
    import statusTypes, { callStatuses, otherStatuses } from '@/enum/statusTypes'
    import cardWidgetMixin from '@/mixins/cardWidgetMixin'

    export default {
        mixins: [extensionMixin, cardWidgetMixin],
        props: {
            status: {
                type: Number,
                default: 3,
            },
            showText: {
                type: Boolean,
                default: true,
            },
            displayBorder: {
                type: Boolean,
                default: true,
            },
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        components: {
            UpdateDialog: () => import('./UpdateDialog'),
            AutoComplete: () => import('@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'),
            [Option.name]: Option,
            [Select.name]: Select,
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            CancelButton: () => import("@/components/Common/Buttons/CancelButton"),
            ConfirmButton: () => import("@/components/Common/Buttons/ConfirmButton")
        },
        data() {
            return {
                showModal: false,
                selectedStatus: '',
                selectedIcon: '',
                selectedOption: {},
                showStatusText: this.showText,
                displayItemBorder: this.displayBorder,
                model: {},
                layoutConfig: {},
                activeCollapse: ['filters'],
                AUTO_COMPLETE_PARAMETER_TYPE: 6,
                USER_ID_LIST_KEY: '{|User_ID_id_list|}'
            }
        },
        computed: {
            autoCompletes() {
                return this.model.WidgetConfig.filter(c => c.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE)
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
            },
            userToDisplay() {
                return get(this.data.WidgetConfig, '[0].WidgetParameterValueJson.EntityPositive', [])
            },
            cardValue() {
                const userToDisplay = this.userToDisplay

                if (this.status === otherStatuses.AT_WORK) {
                    return this.extensionWithCalls.filter(el => el.representativeStatus !== LOGOUT_STATUS && userToDisplay.includes(el.userID)).length || '0'
                }

                return this.extensionWithCalls.filter(el => el.representativeStatus === this.status && userToDisplay.includes(el.userID)).length || '0'
            },
            cardIcon() {
                return statusTypes[this.status].icon
            },
            cardText() {
                return this.$t(this.$store.getters['entities/getStatusTextById'](this.status))
            },
            textColor() {
                let color = statusTypes[this.status].color
                return {
                    color: `${color}`,
                }
            },
            getAccountStatuses () {
                return this.$store.getters['entities/accountStatuses']
            }
        },
        methods: {
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
            onChange() {
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
                    console.warn(e)
                }

                let data = {
                    status: this.selectedStatus,
                    showText: this.showStatusText,
                    displayBorder: this.displayItemBorder,
                }

                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...data,
                    ...this.layoutConfig,
                    colors: this.model.colors,
                };

                this.data.WidgetConfig = this.model.WidgetConfig

                this.$emit('on-update', this.data);
                this.showModal = false;
            },
            onStatusChange(value) {
                let option = statusTypes[value];
                this.selectedOption = option;
                this.selectedStatus = option.value;
                this.selectedIcon = option.icon;
            },
            onShowModal() {
                this.showModal = true
            },
            isAutoComplete(WidgetConfig) {
                return WidgetConfig.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE
            },
            styleForStatusIconColor (status) {
                const statusACtive = typeof status === 'object' ? 'StatusID' in  status ? status.StatusID : status.value : status
                const dynamicColor = this.getAccountStatuses.find(el => Number(el.StatusID) === Number(statusACtive))
                const color = dynamicColor && dynamicColor.ColorCode ? dynamicColor.ColorCode :  statusTypes[statusACtive].color

                return {
                    '--status-svg-color': color
                }
            }
        },
        mounted() {
            this.selectedStatus = this.status;
            this.selectedOption = statusTypes[this.status];
            this.selectedIcon = this.selectedOption.icon;
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultCardColors)
                },
            },
        },
    }
</script>
