<template>
    <div>
        <base-wrapper
            :cardIcon="cardIcon"
            :cardText="cardText"
            :cardValue="cardValue"
            :layoutWidth="layoutWidth"
            :showText="showStatusText"
            :styles="getStyles"
            @show-modal="onShowModal"
            v-bind="$attrs"
            v-on="$listeners"
        />
        <update-dialog
            :model="model"
            :visible.sync="showModal"
            @on-change="onChange"
            v-if="showModal">
            <template v-slot:content>
                <el-form :label-position="labelPosition" @submit.native.prevent="onChange">
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
                    <el-form-item>
                        <el-checkbox v-model="showStatusText">
                            {{$t('status.show.text')}}
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="displayItemBorder">
                            {{$t('status.display.border')}}
                        </el-checkbox>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:width>
                <label class="pt-3 pb-2">{{$t('Widget max width')}}</label>
                <el-input type="number" v-model="layoutWidth.maxWidth"/>
                <label class="pt-3 pb-2">{{$t('Widget min width')}}</label>
                <el-input type="number" v-model="layoutWidth.minWidth"/>
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
    import {Checkbox, Option, Select, Tooltip} from 'element-ui'
    import UpdateDialog from './UpdateDialog'
    import {typeKeys, typeNames, types} from '@/enum/queueCounters'
    import {EditIcon, MoreVerticalIcon, TrashIcon} from 'vue-feather-icons'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import queueMixin from '@/mixins/queueMixin'
    import {timeFormatter} from "@/helpers/timeFormatter";
    import {getInitialTime} from '@/util/timeUtils'

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
                labelPosition: 'top',
                selectedQueues: this.queues,
                selectedType: this.queueType,
                availableTypes: typeNames,
                showStatusText: this.showText,
                displayItemBorder: this.displayBorder,
                timeout: null,
                dataCount: 0,
                model: {},
                layoutWidth: {},
            }
        },
        computed: {
            filteredQueue () {
                return this.allQueues.filter(e => this.selectedQueues.includes(e.QueueID))
            },
            cardValue () {
                clearInterval(this.timeout)
                this.dataCount = 0
                if (this.selectedType === typeKeys.CALLERS_ID) {
                    this.dataCount = this.allQueueCalls.length
                } else if (this.selectedType === typeKeys.MAXIMUM_WAITING_ID) {
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

                    if (queueCalls > 0) {
                        this.dataCount = getInitialTime(minJoinTimeStamp)
                        this.timeout = setInterval(() => {
                            this.dataCount++
                        }, 1000)
                        this.dataCount = timeFormatter(this.dataCount)
                    } else {
                        this.dataCount = timeFormatter(this.dataCount)
                    }
                }

                return this.dataCount
            },
            cardIcon () {
                return types[this.queueType].icon
            },
            cardText () {
                return this.$t(types[this.queueType].text)
            },
            getStyles () {
                let styles = {}
                let color = types[this.queueType].color

                styles = {
                    color: {
                        'color': color,
                    }
                };

                if (this.displayBorder) {
                    let border = {'border': `2px solid ${color}`}
                    styles = {
                        ...styles,
                        ...border,
                    }
                }
                return styles;
            },
        },
        methods: {
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
        },
        mounted () {
            this.layoutWidth = {
                maxWidth: this.data.WidgetLayout['maxWidth'] || '400',
                minWidth: this.data.WidgetLayout['minWidth'] || '250'
            }
        },
        beforeDestroy () {
            clearInterval(this.timeout)
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultColors)
                }
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
</style>
