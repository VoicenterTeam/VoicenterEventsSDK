<template>
    <ConfirmDialog :title="$t('Edit Report Item')"
                   v-bind="$attrs"
                   v-on="$listeners"
                   @close="onCancel()"
                   :modal-width="modalWidth"
                   :title-centered="true">
        <el-form @submit.native.prevent="onSubmit"
                 ref="duplicateForm"
                 :model="model"
        >
            <el-form-item>
                <label for="name">
                    {{ $t('widget.widgetName') }}
                </label>
                <el-input id="name"
                          v-model="model.ReportItemName"/>
            </el-form-item>
            <el-form-item>
                <label for="description">
                    {{ $t('general.description') }}
                </label>
                <el-input id="description"
                          v-model="model.ReportItemDescription"/>
            </el-form-item>
            <el-form-item>
                <div class="grid grid-cols-2">
                    <el-checkbox class="col-span-1"
                                 @change="onTriggerExportType($event, pdfTypeID)"
                                 :value="exportToPdf">
                        <span class="truncate">
                            {{ $t('report.exportToPdf') }}
                        </span>
                    </el-checkbox>
                    <el-checkbox class="col-span-1"
                                 @change="onTriggerExportType($event, csvTypeID)"
                                 :value="exportToCsv">
                        <span class="truncate">
                        {{ $t('report.exportToCsv') }}
                        </span>
                    </el-checkbox>
                </div>
            </el-form-item>
        </el-form>
        <template v-slot:footer-actions>
            <slot name="footer-actions">
                <base-button class="mx-4"
                             @click="onCancel()"
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
                             @click="onSubmit()">
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
    import get from 'lodash/get'
    import { Checkbox } from 'element-ui'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    
    export default {
        components: {
            ConfirmDialog,
            [Checkbox.name]: Checkbox,
        },
        props: {
            item: {
                type: Object,
                default: () => ({}),
            },
            csvTypeID: {
                type: Number,
                default: 1,
            },
            pdfTypeID: {
                type: Number,
                default: 2,
            },
            bothTypeID: {
                type: Number,
                default: 3,
            }
        },
        data() {
            return {
                modalWidth: '600px',
                model: {
                    ReportItemName: '',
                    ReportItemDescription: '',
                },
            }
        },
        computed: {
            exportToPdf() {
                const ReportExportTypeID = get(this.model, 'ReportItemExport[0].ReportExportTypeID', false)
                if (!ReportExportTypeID) {
                    return
                }
                return [this.pdfTypeID, this.bothTypeID].includes(ReportExportTypeID)
            },
            exportToCsv() {
                const ReportExportTypeID = get(this.model, 'ReportItemExport[0].ReportExportTypeID', false)
                if (!ReportExportTypeID) {
                    return
                }
                return [this.csvTypeID, this.bothTypeID].includes(ReportExportTypeID)
            },
        },
        methods: {
            onSubmit() {
                this.$emit('on-confirm', this.model)
            },
            onCancel() {
                this.$emit('on-cancel')
            },
            onTriggerExportType(state, type) {
                if (state) {
                    this.model.ReportItemExport[0].ReportExportTypeID += type
                } else {
                    this.model.ReportItemExport[0].ReportExportTypeID -= type
                }
            },
            
        },
        watch: {
            '$attrs.visible': {
                handler(value) {
                    if (value) {
                        const { widget } = this.item
                        this.model = { ...widget }
                    }
                },
            },
        },
    }
</script>
