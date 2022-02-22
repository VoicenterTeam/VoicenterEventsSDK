<template>
    <Dialog
        v-bind="$attrs"
        v-on="$listeners"
        :title="title"
        :config="config"
        modalWidth="616px"
    >
        <template v-slot:title>
            <div class="flex w-full justify-center font-bold text-lg">
                {{title}}
            </div>
        </template>
        <template>
            <div class="py-12">
                <div class="flex w-full justify-center mb-8">
                    <div class="w-3/5">
                        <label class="flex flex-wrap mb-2">
                            <i class="vc-icon-name icon-lg mx-1 text-primary"/>
                            <span class="my-auto">Report Name</span>
                        </label>
                        <el-input placeholder="Report Name (copy)" v-model="reportCopyName"></el-input>
                    </div>
                </div>
                <div class="w-full">
                    <el-checkbox v-model="isDuplicateSchedules">Duplicate Schedules settings</el-checkbox>
                    <el-checkbox v-model="isDuplicateWidgets">Duplicate Widgets settings</el-checkbox>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script>
import {Input, Checkbox} from 'element-ui'
import Dialog from '@/components/Dialogs/Dialog'

export default {
    components: {
        [Input.name]: Input,
        [Checkbox.name]: Checkbox,
        Dialog,
    },
    data() {
        return {
            title: 'Duplicate Report',
            reportCopyName: '',
            isDuplicateWidgets: true,
            isDuplicateSchedules: true,
            config: {
                confirmText: 'Save'
            }
        }
    },
    watch: {
        isDuplicateSchedules(newV) {
            this.$emit('update:is-duplicate-schedules', newV);
        },
        isDuplicateWidgets(newV) {
            this.$emit('update:is-duplicate-widgets', newV);
        },
        reportCopyName(newV) {
            this.$emit('update:report-copy-name', newV);
        }
    }
}
</script>
