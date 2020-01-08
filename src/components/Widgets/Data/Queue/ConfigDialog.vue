<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
        <el-form @submit.native.prevent="onUpdate" :label-position="labelPosition">
            <div class="flex w-full">
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
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onUpdate">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog, Select, Option} from 'element-ui'

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
        },
        data() {
            return {
                labelPosition: 'top',
                selectedQueues: this.showQueues,
            }
        },
        methods: {
            onUpdate() {
                this.$emit('on-update', this.selectedQueues);
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

    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
        color: var(--primary-color);
    }
</style>
