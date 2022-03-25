<template>
    <span>
        <div class="switch-label" v-if="label">
            {{ $t(label) }}
            <slot name="label" />
        </div>
        <el-switch
            v-model="model"
            :disabled="disabled"
            @change="onChange"
        />
    </span>
</template>

<script>
import { Switch } from 'element-ui'

export default {
    components: {
        [Switch.name]: Switch, 
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
        inputValue: {
            type: [Boolean]
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
            return this.$store.getters['reportTrigger/getReportTriggerData'].ScheduleData
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
.switch-label {
    @apply mb-2;
}
[dir="rtl"] .switch-label {
    @apply ml-3;
}
[dir="ltr"] .switch-label {
    @apply mr-3;
}
</style>