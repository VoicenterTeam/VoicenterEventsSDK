<template>
    <div :style="getStyles"
         class="w-full bg-white px-6 flex items-center justify-between rounded-lg shadow widget-card p-4">
        <div class="w-full flex items-center">
            <slot name="icon">
                <component :is="cardIcon" class="min-w-16 mx-1 text-primary"/>
            </slot>
            <slot name="text">
                <el-tooltip :content="queueText" class="item" effect="dark" placement="top" v-if="showText">
                    <h5 :style="textColor" class="text-main-xl font-bold mx-3 status-text">
                        {{queueText}}
                    </h5>
                </el-tooltip>
            </slot>
            <div :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
                <slot name="value">
                    <h5 :style="textColor" class="text-6xl font-bold -mr-3">
                        {{cardValue}}
                    </h5>
                </slot>
            </div>
            <div class="flex editable-content" v-if="editable">
                <el-tooltip :content="$t('tooltip.remove.widget')" class="item" effect="dark" placement="top">
                    <trash-icon @click="$emit('remove-item')"
                                class="flex align-center w-8 h-8 p-2 text-red trash-icon"/>
                </el-tooltip>
                <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                    <edit-icon @click="()=>{this.showModal = true}"
                               class="flex align-center w-10 h-8 p-2 edit-icon text-primary"/>
                </el-tooltip>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"/>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"/>
            </div>
            <div class="flex" v-else>
                <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                    <edit-icon @click="()=>{this.showModal = true}"
                               class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"/>
                </el-tooltip>
            </div>
        </div>
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
    import {getServerTimeOffset} from '@/enum/generic'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import queueMixin from '@/mixins/queueMixin'

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
            editable: {
                type: Boolean,
                default: () => true
            },
            showText: {
                type: Boolean,
                default: () => false
            },
            displayBorder: {
                type: Boolean,
                default: false
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
                layoutWidth: '',
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
                    let minJoinTimeStamp = (new Date()).getTime() + getServerTimeOffset() / 1000
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
                        this.dataCount = parseInt((new Date()).getTime() / 1000) + getServerTimeOffset() / 1000 - minJoinTimeStamp
                        setInterval(() => {
                            this.dataCount++
                        }, 1000)
                    }
                }
                return this.dataCount
            },
            cardIcon () {
                return types[this.queueType].icon
            },
            queueText () {
                return this.$t(types[this.queueType].text)
            },
            textColor () {
                let color = types[this.queueType].color
                return {
                    color: `${color}`
                }
            },
            getStyles () {
                if (!this.displayBorder) return;
                let color = types[this.queueType].color
                return {
                    border: `2px solid ${color}`,
                }
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
