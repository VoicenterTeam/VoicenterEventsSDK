<template>
    <div class="time-picker">
        <div class="time-picker-label" v-if="label">
            {{ $t(label) }}
            <slot name="label" />
        </div>
        <el-select
            :placeholder="$t('ConditionFilterColumnType.Distributor_ID_id_list')"
            @change="onChange"
            class="w-full"
            v-model="model">
            <el-option
                :key="option.value"
                :label="$t(option.dist_name)"
                v-bind="option"
                v-for="option in allAccounts"
                :value="option.AccountID"
            >
                <div class="flex">
                    {{ option.dist_name }}
                </div>
            </el-option>
        </el-select>
        <div class="el-form-item__error" v-show="isNotValidField && !isCondition">
          {{ $t('validation.error.fieldIsRequired') }}
        </div>
    </div>
</template>
<script>
    import { Select, Option } from 'element-ui'

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
                type: Number
            },
            isCondition: {
                type: Boolean,
                default: false
            }
        },
        components: {
            [Select.name]: Select,
            [Option.name]: Option
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
                return this.$store.getters['reportTrigger/getReportData'].ScheduleData
            },
            isNotValidField () {
                return this.isClickedOnNextBtn && !this.model
            },
            allAccounts () {
                return this.$store.getters['entities/getEntityList']('Accounts')
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
