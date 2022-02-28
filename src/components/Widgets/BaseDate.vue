<template>
    <div class="date-picker">
        <div class="date-picker-label" v-if="label">
            {{ $t(label) }}
            <slot name="label" />
        </div>
        <el-date-picker
            v-model="model"
            @change="onChange"
            type="date"
        />
        <div class="el-form-item__error" v-show="isNotValidField">
          Field is required
        </div>
    </div>
</template>
<script>
    import { DatePicker } from 'element-ui'
    
    export default {
        components: {
            [DatePicker.name]: DatePicker,
        },
        props: {
            pickerOptions: {
                type: Object,
                default: () => ({}),
            },
            value: {
                type: Date,
                default: null,
            },
            label: {
                type: String,
                default: '' 
            },
            isClickedOnNextBtn: {
                type: Boolean,
                default: false
            },
            inputValue: {
                type: Date
            },
            isCondition: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                model: null
            }
        },
        watch: {
            model (val) {
                const data = {
                    value: val,
                    component: this.$attrs
                }
                this.$emit('change', data)
            }
        },
        mounted () {
            if (this.isCondition) {
                this.model = this.inputValue
            } else {
                this.model = this.getReportScheduleData[this.$attrs.ComponentTag]
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
<style lang="scss" scoped>
.date-picker ::v-deep {
    .el-date-editor, .el-date-editor--data {
        @apply w-36;
    }
}
.date-picker-label {
    @apply mb-3;
}
[dir="rtl"] .date-picker-label {
    @apply ml-3;
}
[dir="ltr"] .date-picker-label {
    @apply mr-3;
}
.el-form-item__error {
    @apply pt-2;
}
.date-picker {
    @apply relative;
}
.date-picker-label {
    @apply mb-3;
}
</style>
