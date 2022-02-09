<template>
    <ConfirmDialog :title="$t('report.editReportItem')"
                   :modal-width="modalWidth"
                   :title-centered="true"
                   @on-cancel="onCancel"
                   @on-submit="onSubmit"
                   @close="onCancel"
                   v-bind="$attrs"
                   v-on="$listeners"
    >
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
                <cancel-button
                    @on-click="onCancel"
                />
                <confirm-button
                    :label="$t('Save')"
                    icon="IconSave"
                    @on-click="onSubmit"
                />
            </slot>
        </template>
    </ConfirmDialog>
</template>

<script>
    import get from 'lodash/get'
    import { Checkbox } from 'element-ui'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import CancelButton from "@/components/Common/Buttons/CancelButton"
    import ConfirmButton from "@/components/Common/Buttons/ConfirmButton"

    export default {
        components: {
            ConfirmDialog,
            [Checkbox.name]: Checkbox,
            CancelButton,
            ConfirmButton
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
