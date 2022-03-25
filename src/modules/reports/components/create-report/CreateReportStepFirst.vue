<template>
    <div class="h-full w-full create-report">
        <div class="h-full flex items-center flex-wrap step-first">
            <div class="field">
                <div class="mb-2 flex items-center">
                    <i class="vc-icon-name label-icon text-primary" /> {{ $t('report.name') }}
                </div>
                <el-input :placeholder="$t('report.name')" v-model="report.ReportName"></el-input>
                <div class="el-form-item__error" v-show="clickedOnNextBtn && checkIfValueIsEmpty(report.ReportName)">
                    {{ $t('validation.error.fieldIsRequired') }}
                </div>
            </div>
            <div class="field">
                <div class="mb-2 flex items-center">
                    <i class="vc-icon-real-time label-icon text-primary" /> {{ $t('report.status') }}
                </div>
                <div class="h-10 flex items-center">
                    <el-switch
                        v-model="report.ReportStatusID"
                        :active-text="report.ReportStatusID === 1 ? $t('report.wizard.enabled') : $t('report.switch.disable')"
                        inactive-text=""
                        :active-value="1"
                        :inactive-value="2" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            report: {
                ReportName: '',
                ReportStatusID: 0
            },
            clickedOnNextBtn: false
        }
    },
    computed: {
        getReportData () {
            return this.$store.getters['report/getReportData']
        }
    },
    async mounted () {
        this.report = {
            ReportName: this.getReportData.ReportName || this.$t('report.name'),
            ReportStatusID: this.getReportData.ReportStatusID
        }
        await this.$store.dispatch('report/updateReportData', this.report)
    },
    methods: {
        async validate () {
            this.clickedOnNextBtn = true

            if (this.checkIfValuesIsEmpty()) {
                return
            }

            await this.$store.dispatch('report/updateReportData', this.report)

            return true
        },
        checkIfValuesIsEmpty () {
            return Object.values(this.report).some(el => el === '' || el === null )
        },
        checkIfValueIsEmpty (value) {
            return value === '' || value === null
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form-item__error {
    @apply pt-2;
}
.field {
    @apply relative;
}

[dir="ltr"] .field {
    @apply mr-8;
}
[dir="rtl"] .field {
    @apply ml-8;
}
.field:not(:last-child) {
    max-width: 392px;
    width: 100%;
}
::v-deep .el-switch.is-checked .el-switch__core {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
}
::v-deep .el-switch__label.is-active {
    @apply text-primary;
}
[dir="rtl"] .label-icon {
    @apply ml-2;
}
[dir="ltr"] .label-icon  {
    @apply mr-2;
}
</style>

<style lang="scss">
[dir="rtl"] .create-report .el-switch__label {
    @apply mr-2;
}
[dir="ltr"] .create-report .el-switch__label {
    @apply ml-2;
}
</style>