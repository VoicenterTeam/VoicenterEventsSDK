<template>
    <div class="h-full w-full">
        <div class="h-full flex items-center flex-wrap step-first">
            <div class="field">
                <div class="mb-2 flex items-center">
                    <i class="vc-icon-name mr-2 text-primary" /> {{ $t('report.name') }}
                </div>
                <el-input :placeholder="$t('report.name')" v-model="report.ReportName"></el-input>
                <div class="el-form-item__error" v-show="clickedOnNextBtn && checkIfValueIsEmpty(report.ReportName)">
                    {{ $t('validation.error.fieldIsRequired') }}
                </div>
            </div>
            <div class="field">
                <div class="mb-2 flex items-center">
                    <i class="vc-icon-real-time mr-2 text-primary" /> {{ $t('report.status') }}
                </div>
                <div class="h-10 flex items-center">
                    <el-switch
                        v-model="report.ReportStatusID"
                        :active-text="report.ReportStatusID ? $t('report.wizard.enabled') : $t('report.switch.disable')"
                        inactive-text=""
                        :active-value="1"
                        :inactive-value="0" />
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
.field:not(:last-child) {
    @apply mr-8;
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
</style>