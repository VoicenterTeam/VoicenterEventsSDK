<template>
    <div class="user-select">
        <div class="user-select-label" v-if="label">
            {{ $t(label) }}
            <slot name="label" />
        </div>
        <el-select
            :placeholder="$t('ConditionFilterColumnType.User_ID_id_list')"
            @change="onChange"
            class="w-full"
            v-model="model">
            <el-option
                :key="option.value"
                v-bind="option"
                v-for="option in allUsers"
                :value="option.user_id"
                :label="$t(option.user_name)">
                <div class="flex">
                    {{ option.user_name }}
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
            allUsers () {
                return this.$store.getters['entities/getEntityList']('Users')
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

.user-select-label {
    @apply mb-3;
}
[dir="rtl"] .user-select-label {
    @apply ml-3;
}
[dir="ltr"] .user-select-label {
    @apply mr-3;
}
.el-form-item__error {
    @apply pt-2;
}
.user-select {
    @apply relative;
}
</style>
