<template>
    <div>
        <base-wrapper
            class="queue-card"
            :cardIcon="cardIcon"
            :cardText="cardText"
            :cardValue="cardValue"
            :layoutWidth="layoutWidth"
            :showText="showStatusText"
            :styles="getCardStyles"
            @show-modal="onShowModal"
            v-bind="$attrs"
            v-on="$listeners"
        />
        <update-dialog
            :model="model"
            :layoutWidth="layoutWidth"
            :visible.sync="showModal"
            @on-change="onChange"
            v-if="showModal">
            <template v-slot:content>
                <el-form @submit.native.prevent="onChange">
                    <div class="flex w-full flex-col lg:flex-row">
                        <div class="flex lg:w-1/2">
                            <el-form-item :label="$t('queues.to.display')" class="font-bold">
                                <base-select
                                    :class="$rtl.isRTL ? 'lg:pl-2' : 'lg:pr-2'"
                                    :data="allQueues"
                                    collapse-tags
                                    filterable
                                    label-key="QueueName"
                                    multiple
                                    v-model="selectedQueues"
                                    value-key="QueueID">
                                </base-select>
                            </el-form-item>
                        </div>
                        <div class="flex lg:w-1/2">
                            <el-form-item :label="$t('queue.counter.type')" class="font-bold">
                                <el-select
                                    :class="$rtl.isRTL ? 'lg:pr-2' : 'lg:pl-2'"
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
                        </div>
                    </div>
                    <div class="py-4 flex">
                        <el-checkbox v-model="showStatusText">
                            {{$t('status.show.text')}}
                        </el-checkbox>
                        <el-checkbox class="px-4" v-model="displayItemBorder">
                            {{$t('status.display.border')}}
                        </el-checkbox>
                    </div>
                </el-form>
            </template>
            <template v-slot:footer>
                <el-button @click="showModal = false">{{$t('common.cancel')}}</el-button>
                <el-button @click="onChange" type="primary">{{$t('common.save')}}</el-button>
            </template>
        </update-dialog>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Option, Select, Tooltip, Checkbox} from 'element-ui'
    import UpdateDialog from './UpdateDialog'
    import {typeKeys, typeNames, types} from '@/enum/queueCounters'
    import {EditIcon, MoreVerticalIcon, TrashIcon} from 'vue-feather-icons'
    import {defaultCardColors} from '@/enum/defaultWidgetSettings'
    import queueMixin from '@/mixins/queueMixin'
    import {getInitialTime} from '@/util/timeUtils'
    import Timer from "@/util/Timer";

    export default {
        mixins: [queueMixin],
        props: {
            queues: {
                type: Array,
                default: () => []
            },
            queueType: {
                type: Number,
                default: () => 0
            },
            showText: {
                type: Boolean,
                default: () => true
            },
            displayBorder: {
                type: Boolean,
                default: true
            },
            data: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            TrashIcon,
            EditIcon,
            MoreVerticalIcon,
            UpdateDialog,
            [Select.name]: Select,
            [Option.name]: Option,
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
        },
        data () {
            return {
                showModal: false,
                selectedQueues: this.queues,
                selectedType: this.queueType,
                availableTypes: typeNames,
                showStatusText: this.showText,
                displayItemBorder: this.displayBorder,
                timeout: null,
                timer: new Timer(),
                model: {},
                layoutWidth: {},
            }
        },
        computed: {
            filteredQueue () {
                return this.allQueues.filter(e => this.selectedQueues.includes(e.QueueID))
            },
            cardValue () {
                if (this.selectedType === typeKeys.CALLERS_ID) {
                    return this.allQueueCalls.length
                }
                return this.timer.displayTime
            },
            cardIcon () {
                return types[this.queueType].icon
            },
            cardText () {
                return this.$t(types[this.queueType].text)
            },
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
        },
        methods: {
            getQueueStats() {
                let minJoinTimeStamp = new Date().getTime() * 10000
                let queueCalls = 0
                this.filteredQueue.forEach((queue) => {
                    queue.Calls.forEach((call) => {
                        if (call.JoinTimeStamp < minJoinTimeStamp) {
                            minJoinTimeStamp = call.JoinTimeStamp
                            queueCalls++
                        }
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
            onChange () {
                let data = {
                    queues: this.selectedQueues,
                    queueType: this.selectedType,
                    showText: this.showStatusText,
                    displayBorder: this.displayItemBorder,
                }

                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...data,
                    ...this.model,
                    ...this.layoutWidth
                }

                this.$emit('on-update', this.data);
                this.showModal = false;
            },
            onShowModal () {
                this.showModal = true
            },
            setCounterState() {
                let callCount = this.getQueueStats().queueCalls
                this.timer.stop()
                this.timer.setValue(this.getInitialQueueTime())
                if (callCount !== 0) {
                    this.timer.start()
                }
            }
        },
        mounted () {
            this.layoutWidth = {
                maxWidth: this.data.WidgetLayout['maxWidth'] || '400',
                minWidth: this.data.WidgetLayout['minWidth'] || '250',
                maxHeight: this.data.WidgetLayout['maxHeight'] || 'auto',
                minHeight: this.data.WidgetLayout['minHeight'] || '100',
            }
        },
        beforeDestroy () {
            this.timer.destroy()
        },
        watch: {
            data: {
                immediate: true,
                handler(widget) {
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultCardColors)
                }
            },
            selectedType: {
                immediate: true,
                handler() {
                    this.setCounterState()
                }
            },
            'allQueueCalls.length'() {
                this.setCounterState()
            }
        }
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
