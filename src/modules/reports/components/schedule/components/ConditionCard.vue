<template>
    <div
        class="shadow-base rounded-lg w-full flex lg:flex-row justify-between items-center py-7"
        :class="$rtl.isRTL ? 'pr-8' : 'pl-8'"
    >
        <div class="flex w-1/4">
            <base-select
                class="w-full"
                :multiple="false"
                :placeholder="$t('Select Widget')"
                :data="reportItemData.ReportItemList"
                v-model="condition.WidgetID"
                id="parameter"
                labelKey="WidgetTitle"
                valueKey="WidgetID"
            />
        </div>
        <div class="flex w-1/4 lg:mx-6 relative">
            <base-select
                class="w-full"
                :multiple="false"
                :disabled="disableField"
                :placeholder="$t('Widget Column')"
                :data="widgetTemplateList"
                v-model="condition.WidgetTemplateColumnID"
                id="parameter"
                labelKey="WidgetTemplateColumnsName"
                valueKey="WidgetTemplateColumnsID"
            />
            <div class="el-form-item__error" v-show="isValidWidgetTemplateColumnID">
                {{ $t('validation.error.fieldIsRequired') }}
            </div>
        </div>
        <div class="flex w-1/4 relative"
             :class="$rtl.isRTL ? 'ml-6' : 'mr-6'">
            <base-select
                :disabled="disableField"
                class="w-full"
                :multiple="false"
                :placeholder="$t('Select Aggregation')"
                :data="conditionFilterColumnTypeList"
                v-model="condition.ConditionFilterColumnTypeID"
                id="operator"
                labelKey="ConditionFilterColumnName"
                valueKey="ConditionFilterColumnTypeID"
            />
            <div class="el-form-item__error" v-show="isValidConditionFilterColumnTypeID">
                {{ $t('validation.error.fieldIsRequired') }}
            </div>
        </div>
        <div class="flex w-1/4 relative"
            :class="$rtl.isRTL ? 'ml-6' : 'mr-6'">
            <base-select
                :disabled="disableField"
                class="w-full"
                :multiple="false"
                :placeholder="$t('Select Operator')"
                :data="widgetTemplateColumnOperatorList"
                v-model="condition.ConditionFilterOperatorID"
                id="operator"
                labelKey="ConditionFilterOperatorSymbol"
                valueKey="ConditionFilterOperatorID"
            />
            <div class="el-form-item__error" v-show="isValidConditionFilterOperatorID">
                {{ $t('validation.error.fieldIsRequired') }}
            </div>
        </div>
        <div class="w-1/4 relative">
            <div class="flex">
                <component
                    v-if="isChangedWidgetTemplateColumnID && getComponentNameOfValueField"
                    :is="getComponentName(getComponentNameOfValueField)"
                    :key="getComponentNameOfValueField.ComponentTag"
                    v-bind="getComponentNameOfValueField"
                    @change="onChange"
                    :disabled="disableField"
                    :placeholder="$t('general.value')"
                    :input-value="condition.ConditionFilterValue"
                    is-condition
                    class="w-full"
                />
                <div class="el-form-item__error" v-show="isValidConditionFilterValue && getComponentNameOfValueField">
                    {{ $t('validation.error.fieldIsRequired') }}
                </div>
            </div>
        </div>
        <div class="mx-4">
            <slot name="delete-button"/>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            condition: {
                type: [Object, Array],
                default: () => ({})
            },
            reportItemData: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            BaseTimeRange: () => import('@/modules/common/components/form/BaseTimeRange'),
            BaseInterval: () =>  import('@/modules/common/components/form/BaseInterval'),
            BaseDate: () =>  import('@/components/Widgets/BaseDate'),
            BaseDayOfTheWeek: () =>  import('@/modules/common/components/form/BaseDayOfTheWeek'),
            BaseInputText: () =>  import('@/modules/common/components/form/BaseInputText'),
            BaseInputNumber: () =>  import('@/modules/common/components/form/BaseInputNumber'),
            BaseUserSelect: () => import('@/modules/common/components/form/BaseUserSelect'),
            BaseAccountSelect: () => import('@/modules/common/components/form/BaseAccountSelect')
        },
        watch: {
            'condition.WidgetID' (val) {
                if (val) {
                    this.condition.WidgetTemplateColumnID = null
                    this.condition.ConditionFilterOperatorID = null
                    this.condition.ConditionFilterColumnTypeID = null
                    this.condition.ConditionFilterValue = null
                }
            },
            'condition.WidgetTemplateColumnID' (val) {
                if (val) {
                    this.condition.ConditionFilterOperatorID = null
                    this.condition.ConditionFilterColumnTypeID = null
                    this.condition.ConditionFilterValue = null
                    this.isChangedWidgetTemplateColumnID = false
                    this.$nextTick(() => {
                        this.isChangedWidgetTemplateColumnID = true
                    })
                }
            }
        },
        data () {
            return {
                isChangedWidgetTemplateColumnID: true
            }
        },
        computed: {
            conditionFilterColumnTypeList () {
                return this.$store.getters['report/getConfData'].ConditionFilterColumnTypeList
            },
            widgetTemplateList () {
                if (this.checkIfValueIsEmpty(this.condition.WidgetID)) {
                    return
                }
                const widgetTemplateID = this.reportItemData.ReportItemList.find(el => el.WidgetID === this.condition.WidgetID).WidgetTemplateID

                return this.$store.getters['report/getConfData'].WidgetTemplateList
                    .find(el => el.WidgetTemplateID === widgetTemplateID).WidgetTemplateColumnList
            },
            widgetTemplateColumnOperatorList () {
                if (this.checkIfValueIsEmpty(this.condition.WidgetID) || this.checkIfValueIsEmpty(this.condition.WidgetTemplateColumnID)) {
                    return []
                }

                return this.widgetTemplateList.find(el => el.WidgetTemplateColumnsID === this.condition.WidgetTemplateColumnID).WidgetTemplateColumnOperatorList
            },
            disableField () {
                return this.checkIfValueIsEmpty(this.condition.WidgetID) || !this.widgetTemplateList.length
            },
            getComponentNameOfValueField () {
                if (this.checkIfValueIsEmpty(this.condition.WidgetTemplateColumnID)) {
                    return
                }

                return this.widgetTemplateList.find(el => el.WidgetTemplateColumnsID === this.condition.WidgetTemplateColumnID).WidgetTemplateColumnParameter

            },
            isValidWidgetTemplateColumnID () {
                if (this.checkIfValueIsEmpty(this.condition.WidgetID)) {
                    return
                }

                return this.checkIfValueIsEmpty(this.condition.WidgetTemplateColumnID) && this.widgetTemplateList.length
            },
            isValidConditionFilterOperatorID () {
                if (this.checkIfValueIsEmpty(this.condition.WidgetID)) {
                    return
                }

                return this.checkIfValueIsEmpty(this.condition.ConditionFilterOperatorID) && this.widgetTemplateList.length
            },
            isValidConditionFilterColumnTypeID () {
                if (this.checkIfValueIsEmpty(this.condition.WidgetID)) {
                    return
                }

                return this.checkIfValueIsEmpty(this.condition.ConditionFilterColumnTypeID) && this.widgetTemplateList.length
            },
            isValidConditionFilterValue () {
                if (this.checkIfValueIsEmpty(this.condition.WidgetID)) {
                    return
                }

                return this.checkIfValueIsEmpty(this.condition.ConditionFilterValue)
            }
        },
        methods: {
            getComponentName (component) {
                const componentTag = 'Base' + component.ComponentTag
                if (componentTag === 'BaseTime') {
                    return 'BaseInterval'
                }
                if (componentTag === 'BaseDayOfMonth') {
                    return 'BaseDate'
                }
                if (componentTag === 'BaseText') {
                    return 'BaseInputText'
                }
                if (componentTag === 'BaseInteger' || componentTag === 'BaseNumber') {
                    return 'BaseInputNumber'
                }

                return componentTag
            },
            onChange (data) {
                this.condition.ConditionFilterValue = data.value
            },
            checkIfValueIsEmpty (value) {
                return value === '' || value === null
            }
        }
    }
</script>

<style lang="scss" scoped>
.time-picker .el-input__inner, ::v-deep .interval .el-date-editor, ::v-deep .el-input-number {
    @apply w-full;
}
.el-form-item__error {
    @apply pt-1;
}
</style>
