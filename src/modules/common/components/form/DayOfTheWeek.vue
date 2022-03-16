<template>
    <div class="transition day-of-week">
        <div class="day-of-week-label" v-if="label">
            {{ $t(label) }}
            <slot name="label" />
        </div>
        <div class="flex">
            <div v-for="day in daysAbbr"
                :key="day.name"
                @click="onChoseDay(day.value)"
                class="transition flex text-sm mx-1 font-normal cursor-pointer rounded-full w-8 h-8 border border-gray-550 text-gray-550 items-center justify-center select-none"
                :class="{'active': model.includes(day.value)}"
            >
                {{ day.name }}
            </div>
        </div>
        <div class="el-form-item__error" v-show="isNotValidField && !isCondition">
          {{ $t('validation.error.fieldIsRequired') }}
        </div>
    </div>
</template>

<script>
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
    data () {
        return {
            daysAbbr: [
                { name: this.$t('general.dayOfWeek.sunday'), value: 7 },
                { name: this.$t('general.dayOfWeek.monday'), value: 1 },
                { name: this.$t('general.dayOfWeek.tuesday'), value: 2 },
                { name: this.$t('general.dayOfWeek.wednesday'), value: 3 },
                { name: this.$t('general.dayOfWeek.thursday'), value: 4 },
                { name: this.$t('general.dayOfWeek.friday'), value: 5 },
                { name: this.$t('general.dayOfWeek.saturday'), value: 6 }
            ],
            model: []
        }
    },
    watch: {
        model (val) {
            if (val && val.length) {
                const data = {
                    value: val,
                    component: this.$attrs
                }
                this.$emit('change', data)
            }
        }
    },
    mounted () {
        if (this.isCondition) {
            this.model = this.inputValue && this.inputValue.length ? this.inputValue : []
        } else {
            const scheduleDataKey = 'ParameterTag' in this.$attrs ? this.$attrs.ParameterTag : this.$attrs.ComponentTag
            this.model = this.getReportScheduleData[scheduleDataKey] && this.getReportScheduleData[scheduleDataKey].length ? this.getReportScheduleData[scheduleDataKey] : []
        }
    },
    computed: {
        getReportScheduleData () {
            return this.$store.getters['reportTrigger/getReportData'].ScheduleData
        },
        isNotValidField () {
            return this.isClickedOnNextBtn && !this.model.length
        }
    },
    methods: {
        onChoseDay(value) {
            const index = this.model.findIndex(el => el === value)
            if (index === -1) {
                this.model.push(value)
            } else {
                this.model.splice(index, 1)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.transition {
    transition: all 0.3s ease-out;
}
.active {
    @apply bg-primary text-white border-primary;
}
.day-of-week {
    @apply relative;
}
.day-of-week-label {
    @apply mb-4;
}
[dir="rtl"] .day-of-week-label {
    @apply ml-3;
}
[dir="ltr"] .day-of-week-label {
    @apply mr-3;
}
.el-form-item__error {
    @apply pt-2;
}
</style>