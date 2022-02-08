<template>
    <ValidationObserver v-slot="{ handleSubmit, valid }" ref="observer">
        <base-form layout="vertical"
                   class="mb-10 -mt-8"
        >
            <ConfirmDialog
                :modal-width="modalWidth"
                :config="dialogConfig"
                @on-cancel="onCancel"
                @on-confirm="handleSubmit(onDuplicate)"
                v-bind="$attrs"
                v-on="$listeners"
            >
                <template v-slot:title>
                    <h3 class="w-full flex justify-center text-2xl font-semibold text-gray-700">
                        {{ $t('report.duplicateReport') }}
                    </h3>
                </template>
                <div class="mx-20 mt-8 mb-20">
                    <base-input rules="required"
                                :name="$t('report.reportName')"
                                :label="$t('report.reportName')"
                                label-icon="IconReportName"
                                v-model="model.ReportName"
                                id="ReportTypeName"
                    />
                </div>
            </ConfirmDialog>
        </base-form>
    </ValidationObserver>
</template>
<script>
    import { Checkbox } from 'element-ui'
    import cloneDeep from 'lodash/cloneDeep'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import BaseForm from '@/modules/common/components/form/BaseForm'
    import BaseInput from '@/modules/common/components/form/BaseInput'

    export default {
        components: {
            BaseForm,
            BaseInput,
            ConfirmDialog,
            [Checkbox.name]: Checkbox,
        },
        props: {
            report: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                modalWidth: '600px',
                model: {
                    ReportName: '',
                },
                dialogConfig: {
                    confirmText: this.$t('Save')
                }
            }
        },
        methods: {
            onDuplicate() {
                const objToEmit = {
                    model: this.model,
                    report: this.report,
                }
                this.$emit('on-confirm', objToEmit)
            },
            onCancel() {
                this.$emit('on-cancel')
            },
        },
        watch: {
            '$attrs.visible': {
                handler(value) {
                    if (!value) {
                        return
                    }
                    this.model.ReportName = cloneDeep(this.report.ReportName)
                },
            },
        },
    }
</script>
