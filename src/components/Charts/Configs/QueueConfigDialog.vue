<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('chart.update')}}</h3>
        <el-form @submit.native.prevent="onUpdate" :label-position="labelPosition">
            <div class="flex w-full flex-col lg:flex-row">
                <div class="flex lg:w-1/2">
                    <el-form-item :label="$t('queues.to.display')">
                        <el-select
                                :class="$rtl.isRTL ? 'lg:pl-2' : 'lg:pr-2'"
                                v-model="selectedQueues"
                                multiple
                                collapse-tags
                                filterable>
                            <el-option
                                    v-for="(queue, index) in queues"
                                    :key="index"
                                    :label="queue.QueueName"
                                    :value="queue.QueueID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex lg:w-1/2">
                    <el-form-item :label="$t('blocks.to.display')">
                        <el-select
                                :class="$rtl.isRTL ? 'lg:pr-2' : 'lg:pl-2'"
                                v-model="selectedSeries"
                                multiple
                                collapse-tags
                                filterable>
                            <el-option
                                    v-for="(serie, index) in series"
                                    :key="index"
                                    :label="$t(serie)"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onUpdate">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog, Select, Option} from 'element-ui'

    const allSeries = [
        'queue.maximum.waiting.time',
        'queue.amount.callers.waiting',
        'queue.agents.available',
        'queue.agents.on.a.call',
        'queue.agents.on.administrative.break',
        'queue.agents.on.break'
    ]

    export default {
        inheritAttrs: false,
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
            [Dialog.name]: Dialog,
        },
        props: {
            queues: {
                type: Array,
                default: () => []
            },
            showQueues: {
                type: Array,
                default: () => []
            },
            showSeries: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                labelPosition: 'top',
                series: allSeries,
                selectedQueues: this.showQueues,
                selectedSeries: this.showSeries
            }
        },
        methods: {
            onUpdate() {
                this.$emit('on-update', {queues: this.selectedQueues, series: this.selectedSeries.sort()});
                this.toggleVisibility(false);
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            }
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
</style>
