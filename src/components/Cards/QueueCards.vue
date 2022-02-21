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
            class="queue-card"
            v-bind="$attrs"
            v-on="$listeners"
        />
        <update-dialog
            :layoutConfig="layoutConfig"
            :model="model"
            :visible.sync="showModal"
            @on-change="onChange"
            v-if="showModal">
            <template v-slot:content>
                <el-form @submit.native.prevent="onChange">
                    <el-form-item :label="$t('queue.counter.type')" class="font-bold">
                        <el-select
                            filterable
                            v-model="selectedType">
                            <el-option
                                :key="index"
                                :label="$t(type)"
                                :value="index"
                                class="queue-type"
                                v-for="(type, index) in availableTypes">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="py-4 flex">
                        <el-checkbox v-model="showStatusText">
                            {{ $t('status.show.text') }}
                        </el-checkbox>
                        <el-checkbox class="px-4" v-model="displayItemBorder">
                            {{ $t('status.display.border') }}
                        </el-checkbox>
                    </div>
                </el-form>
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
                    <el-button @click="showModal = false">{{ $t('common.cancel') }}</el-button>
                    <el-button @click="onChange" type="primary">{{ $t('common.save') }}</el-button>
                </div>
            </template>
        </update-dialog>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import { Checkbox, Option, Select, Tooltip, Collapse, CollapseItem } from 'element-ui'
    import { typeKeys, typeNames, types } from '@/enum/queueCounters'
    import { EditIcon, MoreVerticalIcon, TrashIcon } from 'vue-feather-icons'
    import { defaultCardColors } from '@/enum/defaultWidgetSettings'
    import queueMixin from '@/mixins/queueMixin'
    import { getInitialTime } from '@/util/timeUtils'
    import Timer from '@/util/Timer';
    import cardWidgetMixin from '@/mixins/cardWidgetMixin'
    import { getOptionsList } from '@/helpers/entitiesList';
    import get from 'lodash/get';
    
    export default {
        mixins: [queueMixin, cardWidgetMixin],
        props: {
            queues: {
                type: Array,
                default: () => [],
            },
            queueType: {
                type: Number,
                default: () => 0,
            },
            showText: {
                type: Boolean,
                default: () => true,
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
            TrashIcon,
            EditIcon,
            MoreVerticalIcon,
            UpdateDialog: () => import('./UpdateDialog'),
            AutoComplete: () => import('@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'),
            [Select.name]: Select,
            [Option.name]: Option,
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        data() {
            return {
                showModal: false,
                selectedType: this.queueType,
                availableTypes: typeNames,
                showStatusText: this.showText,
                displayItemBorder: this.displayBorder,
                timeout: null,
                timer: new Timer(),
                model: {},
                layoutConfig: {},
                AUTO_COMPLETE_PARAMETER_TYPE: 6,
                activeCollapse: ['filters'],
            }
        },
        computed: {
            autoCompletes() {
                return this.data.WidgetConfig.filter(c => c.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE)
            },
            allEntityQueues() {
                return getOptionsList('{|queue_list|}')
            },
            queueToDisplay() {
                return get(this.data.WidgetConfig, '[0].WidgetParameterValueJson.EntityPositive', [])
            },
            filteredQueue() {
                return this.allQueues.filter(e => this.queueToDisplay.includes(e.QueueID))
            },
            cardValue() {
                if (this.selectedType === typeKeys.CALLERS_ID) {
                    return this.getQueueStats().queueCalls
                }
                return this.timer.displayTime
            },
            cardIcon() {
                return types[this.queueType].icon
            },
            cardText() {
                return this.$t(types[this.queueType].text)
            },
        },
        methods: {
            getQueueStats() {
                let minJoinTimeStamp = new Date().getTime() * 10000
                let queueCalls = 0
                this.filteredQueue.forEach((queue) => {
                    queue.Calls.forEach((call) => {
                        if (call.JoinTimeStamp < minJoinTimeStamp) {
                            minJoinTimeStamp = call.JoinTimeStamp
                        }
                        queueCalls++
                    })
                })
                return { queueCalls, minJoinTimeStamp }
            },
            getInitialQueueTime() {
                if (this.selectedType !== typeKeys.MAXIMUM_WAITING_ID) {
                    return 0
                }
                
                const queueStats = this.getQueueStats()
                if (queueStats.queueCalls === 0) {
                    return 0
                }
                return getInitialTime(queueStats.minJoinTimeStamp)
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
                    queueType: this.selectedType,
                    showText: this.showStatusText,
                    displayBorder: this.displayItemBorder,
                }
                
                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...data,
                    ...this.layoutConfig,
                    colors: this.model.colors,
                }
                
                this.data.WidgetConfig = this.model.WidgetConfig
                
                this.$emit('on-update', this.data);
                this.showModal = false;
            },
            onShowModal() {
                this.showModal = true
            },
            setCounterState() {
                let callCount = this.getQueueStats().queueCalls
                this.timer.stop()
                this.timer.setValue(this.getInitialQueueTime())
                if (callCount !== 0) {
                    this.timer.start()
                }
            },
            isAutoComplete(WidgetConfig) {
                return WidgetConfig.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE
            },
        },
        beforeDestroy() {
            this.timer.destroy()
        },
        watch: {
            data: {
                deep: true,
                immediate: true,
                handler(widget) {
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultCardColors)
                },
            },
            selectedType: {
                immediate: true,
                handler() {
                    this.setCounterState()
                },
            },
            filteredQueue() {
                this.setCounterState()
            },
        },
    }
</script>
<style lang="scss" scoped>
.el-form-item {
    @apply w-full;
    .el-select {
        @apply w-full;
    }
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    color: var(--primary-color);
}

.queue-card /deep/ .card-value {
    min-width: 80px;
    @apply flex justify-center;
}
</style>
