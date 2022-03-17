<template>
    <div class="account-select">
        <div class="account-select-label" v-if="label">
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
                return this.$store.getters['reportTrigger/getReportTriggerData'].ScheduleData
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
.account-select-label {
    @apply mb-3;
}
[dir="rtl"] .account-select-label {
    @apply ml-3;
}
[dir="ltr"] .account-select-label {
    @apply mr-3;
}
.el-form-item__error {
    @apply pt-2;
}
.account-select {
    @apply relative;
}
</style>
