<template>
    <div class="transition day-of-week mb-5">
        <div class="day-of-week-label" v-if="label">
            {{ $t(label) }}
            <slot name="label" />
        </div>
        <div class="flex">
            <div v-for="day in daysAbbr"
                :key="day"
                @click="onChoseDay(day)"
                class="transition flex text-sm mx-1 font-normal cursor-pointer rounded-full w-8 h-8 border border-gray-550 text-gray-550 items-center justify-center select-none"
                :class="{'active': model.includes(day)}"
            >
                {{ day }}
            </div>
        </div>
        <div class="el-form-item__error" v-show="isNotValidField">
          Field is required
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
                'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'
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
            this.model = this.getReportScheduleData[this.$attrs.ParameterName] && this.getReportScheduleData[this.$attrs.ParameterName].length ? this.getReportScheduleData[this.$attrs.ParameterName] : []
        }
        // this.model = this.inputValue && this.inputValue.length ? this.inputValue : this.getReportScheduleData[this.$attrs.ParameterName] && this.getReportScheduleData[this.$attrs.ParameterName].length ? this.getReportScheduleData[this.$attrs.ParameterName] : []
    },
    computed: {
        getReportScheduleData () {
            return this.$store.getters['report/getReportData'].ScheduleData
        },
        isNotValidField () {
            return this.isClickedOnNextBtn && !this.model.length
        }
    },
    methods: {
        onChoseDay(day) {
            const index = this.model.findIndex(el => el === day)
            if (index === -1) {
                this.model.push(day)
                return
            }
            this.model.splice(index, 1)
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
    @apply mb-3;
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