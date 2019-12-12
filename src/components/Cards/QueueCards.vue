<template>
    <div class="w-full bg-white px-6 py-4 my-4 flex items-center justify-between rounded-lg shadow"
         :style="borderColor">
        <div class="w-full flex items-center">
            <slot name="icon">
                <component class="min-w-16 mx-1 text-primary" :is="cardIcon"/>
            </slot>
            <slot name="text">
                <el-tooltip v-if="showText" class="item" effect="dark" :content="queueText" placement="top">
                    <h5 class="text-xl font-bold mx-3 status-text" :style="textColor">
                        {{queueText}}
                    </h5>
                </el-tooltip>
            </slot>
            <div :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
                <slot name="value">
                    <h5 class="text-6xl font-bold -mr-3" :style="textColor">
                        {{cardValue}}
                    </h5>
                </slot>
            </div>
            <div class="flex editable-content" v-if="editable">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                    <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon"
                                @click="$emit('remove-item')"/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-icon class="flex align-center w-10 h-8 p-2 edit-icon text-primary"
                               @click="()=>{this.showModal = true}"/>
                </el-tooltip>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"/>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"/>
            </div>
            <div v-else class="flex">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-icon class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"
                               @click="()=>{this.showModal = true}"/>
                </el-tooltip>
            </div>
        </div>
        <update-dialog
            v-if="showModal"
            :visible.sync="showModal"
            :model="model"
            @on-change="onChange">
            <template v-slot:content>
                <el-form @submit.native.prevent="onChange" :label-position="labelPosition">
                    <div class="flex w-full flex-col lg:flex-row">
                        <div class="flex lg:w-1/2">
                            <el-form-item class="font-bold" :label="$t('queues.to.display')">
                                <el-select
                                    :class="$rtl.isRTL ? 'lg:pl-2' : 'lg:pr-2'"
                                    v-model="selectedQueues"
                                    collapse-tags
                                    multiple
                                    filterable>
                                    <el-option
                                        v-for="(queue, index) in allQueues"
                                        :key="index"
                                        :label="queue.QueueName"
                                        :value="queue.QueueID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="flex lg:w-1/2">
                            <el-form-item class="font-bold" :label="$t('queue.counter.type')">
                                <el-select
                                    :class="$rtl.isRTL ? 'lg:pr-2' : 'lg:pl-2'"
                                    v-model="selectedType"
                                    filterable>
                                    <el-option
                                        class="queue-type"
                                        v-for="(type, index) in availableTypes"
                                        :key="index"
                                        :label="$t(type)"
                                        :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <el-checkbox v-model="showStatusText" class="pt-4">
                        {{$t('status.show.text')}}
                    </el-checkbox>
                </el-form>
            </template>
            <template v-slot:footer>
                <el-button @click="showModal = false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
            </template>
        </update-dialog>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Tooltip, Select, Option, Checkbox} from 'element-ui'
    import UpdateDialog from './UpdateDialog'
    import {types, typeNames, typeKeys} from '@/enum/queueCounters'
    import {TrashIcon, EditIcon, MoreVerticalIcon} from 'vue-feather-icons'
    import {ISRAEL_TIMEZONE_OFFSET} from '@/enum/generic'
    import {defaultColors} from '@/enum/defaultWidgetSettings'

    export default {
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
        data() {
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
                model: {}
            }
        },
        computed: {
            allQueues() {
                return this.$store.state.queues.all
            },
            filteredQueue() {
                return this.allQueues.filter(e => this.selectedQueues.includes(e.QueueID))
            },
            cardValue() {
                clearInterval(this.timeout)
                this.dataCount = 0
                if (this.selectedType === typeKeys.CALLERS_ID) {
                    this.filteredQueue.forEach((el) => {
                        this.dataCount += el.Calls.length
                    })
                } else if (this.selectedType === typeKeys.MAXIMUM_WAITING_ID) {
                    let minJoinTimeStamp = (new Date()).getTime() + ISRAEL_TIMEZONE_OFFSET / 1000
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
                        this.dataCount = parseInt((new Date()).getTime() / 1000) + ISRAEL_TIMEZONE_OFFSET / 1000 - minJoinTimeStamp
                        setInterval(() => {
                            this.dataCount++
                        }, 1000)
                    }
                }
                return this.dataCount
            },
            cardIcon() {
                return types[this.queueType].icon
            },
            queueText() {
                return this.$t(types[this.queueType].text)
            },
            textColor() {
                let color = types[this.queueType].color
                return {
                    color: `${color}`
                }
            },
            borderColor() {
                if (!this.displayBorder) return;
                let color = types[this.queueType].color
                return {
                    border: `2px solid ${color}`
                }
            },
        },
        methods: {
            onChange() {
                let data = {
                    queues: this.selectedQueues,
                    queueType: this.selectedType,
                    showText: this.showStatusText,
                    displayBorder: this.displayItemBorder,
                }

                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...data,
                    ...this.model
                }

                this.$emit('on-update', this.data);
                this.showModal = false;
            },

        },
        beforeDestroy() {
            clearInterval(this.timeout)
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
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
