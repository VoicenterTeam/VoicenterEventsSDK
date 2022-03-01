<template>
    <div class="time-picker">
        <div class="time-picker-label" v-if="label">
            {{ $t(label) }}
            <slot name="label" />
        </div>
        <el-time-picker
            v-model="model"
            is-range
            :clearable="false"
            range-separator="-"
            start-placeholder="00:00"
            end-placeholder="00:00"
            @change="onChange"
            value-format="HH:mm"
            format="HH:mm"
        />
        <div class="el-form-item__error" v-show="isNotValidField">
          Field is required
        </div>
    </div>
</template>
<script>
    import { TimePicker } from 'element-ui'

    export default {
        props: {
            label: {
                type: String,
                default: '' 
            },
            isClickedOnNextBtn: {
                type: Boolean,
                default: false
            },
            inputValue: {
                type: [Array],
                default: () => []
            },
            isCondition: {
                type: Boolean,
                default: false
            }
        },
        components: {
            [TimePicker.name]: TimePicker
        },
        data () {
            return {
                model: null
            }
        },
        mounted () {
            if (this.isCondition) {
                this.model = this.inputValue
            } else {
                const scheduleDataKey = 'ParameterTag' in this.$attrs ? this.$attrs.ParameterTag : this.$attrs.ComponentTag
                this.model = this.getReportScheduleData[scheduleDataKey]
            }

        },
        computed: {
            getReportScheduleData () {
                return this.$store.getters['report/getReportData'].ScheduleData
            },
            isNotValidField () {
                return this.isClickedOnNextBtn && !this.model
            }
        },
        methods: {
            onChange (val) {
                const data = {
                    value: val,
                    component: this.$attrs
                }

                this.$emit('change', data)
            }
        }
    }
</script>
<style lang="scss">
.el-date-editor .el-range-editor {
    padding: 3px 0 !important;
}
.el-range__icon, .el-range__close-icon {
    display: none !important;
}
.el-date-editor .el-range-input {
    width: 50% !important;
}

.el-time-range-picker > .el-time-range-picker__content {
    .el-time-spinner__item:not(.active):hover {
        @apply text-white bg-primary rounded-full;
    }
    .el-time-spinner__item.active {
        @apply text-primary;
    }
}
.el-time-panel__btn.confirm {
    @apply text-primary;
}
.el-range-editor.is-active, .el-range-editor.is-active:hover {
    @apply border-primary
}
.time-picker-label {
    @apply mb-3;
}
[dir="rtl"] .time-picker-label {
    @apply ml-3;
}
[dir="ltr"] .time-picker-label {
    @apply mr-3;
}
.el-form-item__error {
    @apply pt-2;
}
.time-picker {
    @apply relative;
}
</style>
