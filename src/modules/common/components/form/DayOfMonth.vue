<template>
    <div class="day-of-month">
        <div class="day-of-month-label" v-if="label">
            {{ $t(label) }}
            <slot name="label" />
        </div>
        <el-select
            @change="onChange"
            class="w-full"
            v-model="model"
            multiple
            collapse-tags
        >
            <el-option
                :key="`item-${item}`"
                v-for="item in 31"
                :value="item"
            >
                <div class="flex">
                    {{ item }}
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
                type: Array,
                default: () => []
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
                return this.$store.getters['reportTrigger/getReportTriggerData'].ScheduleData
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
.day-of-month-label {
    @apply mb-2;
}
[dir="rtl"] .day-of-month-label {
    @apply ml-3;
}
[dir="ltr"] .day-of-month-label {
    @apply mr-3;
}
.el-form-item__error {
    @apply pt-2;
}
.day-of-month {
    @apply relative;
}
</style>
