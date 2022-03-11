<template>
    <span class="interval">
        <div class="interval-label" v-if="label">
            {{ $t(label) }}
        </div>
        <el-input v-model="model" @input="onChange" @change="onChange" :placeholder="placeholder" :disabled="disabled"></el-input>
        <div class="el-form-item__error" v-show="isNotValidField && !isCondition">
          {{ $t('validation.error.fieldIsRequired') }}
        </div>
    </span>
</template>

<script>
import { Input } from 'element-ui'

export default {
    components: {
        [Input.name]: Input, 
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: '' 
        },
        placeholder: {
            type: String,
            default: '' 
        },
        isRange: {
            type: Boolean,
            default: false
        },
        isClickedOnNextBtn: {
            type: Boolean,
            default: false
        },
        inputValue: {
            type: [Number, String]
        },
        isCondition: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        model (val) {
            this.$emit('input', val)
        }
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
};
</script>

<style lang="scss" scoped>
.interval-label {
    @apply mb-3;
}
[dir="rtl"] .interval-label {
    @apply ml-3;
}
[dir="ltr"] .interval-label {
    @apply mr-3;
}
.el-form-item__error {
    @apply pt-2;
}
.interval {
    @apply relative;
}
.interval-label {
    @apply mb-3;
}
</style>