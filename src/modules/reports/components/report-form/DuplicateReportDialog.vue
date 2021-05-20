<template>
    <ConfirmDialog v-bind="$attrs"
                   v-on="$listeners"
                   :modal-width="modalWidth"
    >
        <template v-slot:title>
            <h3 class="w-full flex justify-center text-2xl font-semibold text-gray-700">
                {{$t('Duplicate Report')}}
            </h3>
        </template>
        <el-form @submit.native.prevent="onDuplicate"
                 ref="duplicateForm"
                 :model="model"
                 class="p-10"
        >
            <el-form-item class="mx-20">
                <label for="name"
                       class="flex items-center">
                    <IconReportColumn class="text-primary"/>
                    <span class="mx-1">
                        {{ $t('Report Name') }}
                    </span>
                </label>
                <el-input id="name"
                          v-model="model.ReportName"/>
            </el-form-item>
            <el-form-item>
                <div class="flex w-full item-center">
                    <el-checkbox v-model="model.duplicateSettings">
                        <span class="truncate">
                            {{ $t('Duplicate Schedule settings') }}
                        </span>
                    </el-checkbox>
                    <el-checkbox v-model="model.duplicateWidgets">
                        <span class="truncate">
                        {{ $t('Duplicate Widget settings') }}
                        </span>
                    </el-checkbox>
                </div>
            </el-form-item>
        </el-form>
        <template v-slot:footer-actions>
            <slot name="footer-actions">
                <base-button @click="onCancel()"
                             variant="discard"
                             fixed-width="w-37">
                    <div class="flex items-center">
                        <IconDiscard class="mx-1"/>
                        <span class="mx-1 text-base font-bold">
                                {{ 'Cancel' }}
                            </span>
                    </div>
                </base-button>
                <base-button fixed-width="w-37"
                             @click="onDuplicate()">
                    <div class="flex items-center">
                        <IconSave class="mx-1"/>
                        <span class="mx-1 text-base font-bold">
                            {{ $t('Save') }}
                        </span>
                    </div>
                </base-button>
            </slot>
        </template>
    </ConfirmDialog>
</template>
<script>
    import { Checkbox } from 'element-ui'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    
    export default {
        props: {
            report: {
                type: Object,
                default: () => ({}),
            },
        },
        components: {
            ConfirmDialog,
            [Checkbox.name]: Checkbox,
        },
        data() {
            return {
                modalWidth: '600px',
                model: {
                    ReportName: '',
                    duplicateWidgets: true,
                    duplicateSettings: true,
                },
            }
        },
        methods: {
            onDuplicate() {
                this.$emit('on-confirm', this.model)
            },
            onCancel() {
                this.$emit('on-cancel')
            },
        },
        mounted() {
            this.model.ReportName = this.report.ReportName
        },
    }
</script>
