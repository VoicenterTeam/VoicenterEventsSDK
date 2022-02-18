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
                Field is required
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
                Field is required
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
                Field is required
            </div>
        </div>
        <div class="flex w-1/4 relative">
            <component
                v-for="(component, compIndex) in getComponentNameOfValueField"
                :is="getComponentName(component)"
                :key="compIndex"
                v-bind="component"
                @change="onChange"
                :disabled="disableField"
                :placeholder="$t('general.value')"
                :input-value="condition.ConditionFilterValue"
                is-condition
                class="w-full"
            />
            <div class="el-form-item__error" v-show="isValidConditionFilterValue">
                Field is required
            </div>
        </div>
        <div class="mx-4">
            <slot name="delete-button"/>
        </div>
    </div>
</template>
<script>
    import BaseTimeRange from '@/modules/common/components/form/BaseTimeRange'
    import BaseInterval from '@/modules/common/components/form/BaseInterval'
    import BaseDate from '@/components/Widgets/BaseDate'
    import BaseDayOfTheWeek from '@/modules/common/components/form/BaseDayOfTheWeek'
    import BaseInputText from '@/modules/common/components/form/BaseInputText'
    import BaseInputNumber from '@/modules/common/components/form/BaseInputNumber'

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
            BaseTimeRange,
            BaseInterval,
            BaseDate,
            BaseDayOfTheWeek,
            BaseInputText,
            BaseInputNumber
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
                }
            }
        },
        computed: {
            conditionFilterColumnTypeList () {
                return this.$store.getters['report/getConfData'].ConditionFilterColumnTypeList
            },
            widgetTemplateList () {
                if (!this.condition.WidgetID) {
                    return
                }
                const widgetTemplateID = this.reportItemData.ReportItemList.find(el => el.WidgetID === this.condition.WidgetID).WidgetTemplateID

                return this.$store.getters['report/getConfData'].WidgetTemplateList
                    .find(el => el.WidgetTemplateID === widgetTemplateID).WidgetTemplateColumnList
            },
            widgetTemplateColumnOperatorList () {
                if (!this.condition.WidgetID || !this.condition.WidgetTemplateColumnID) {
                    return []
                }

                return this.widgetTemplateList.find(el => el.WidgetTemplateColumnsID === this.condition.WidgetTemplateColumnID).WidgetTemplateColumnOperatorList
            },
            disableField () {
                return !this.condition.WidgetID || !this.widgetTemplateList.length
            },
            getComponentNameOfValueField () {
                if (!this.condition.WidgetTemplateColumnID) {
                    return
                }

                return [this.widgetTemplateList.find(el => el.WidgetTemplateColumnsID === this.condition.WidgetTemplateColumnID).WidgetTemplateColumnParameter]

            },
            isValidWidgetTemplateColumnID () {
                if (!this.condition.WidgetID) {
                    return
                }

                return !this.condition.WidgetTemplateColumnID && this.widgetTemplateList.length
            },
            isValidConditionFilterOperatorID () {
                if (!this.condition.WidgetID) {
                    return
                }

                return !this.condition.ConditionFilterOperatorID && this.widgetTemplateList.length
            },
            isValidConditionFilterColumnTypeID () {
                if (!this.condition.WidgetID) {
                    return
                }

                return !this.condition.ConditionFilterColumnTypeID && this.widgetTemplateList.length
            },
            isValidConditionFilterValue () {
                if (!this.condition.WidgetID) {
                    return
                }

                return !this.condition.ConditionFilterValue && this.condition.WidgetTemplateColumnID && this.widgetTemplateList.length
            }
        },
        methods: {
            getComponentName (component) {
                const componentName = 'Base' + component.ParameterTypeName
                if (componentName === 'BaseTime' || componentName === 'BaseInterval') {
                    return 'BaseInterval'
                }
                if (componentName === 'BaseDayOfMonth') {
                    return 'BaseDate'
                }
                if (componentName === 'BaseText') {
                    return 'BaseInputText'
                }
                if (componentName === 'BaseInteger' || componentName === 'BaseNumber') {
                    return 'BaseInputNumber'
                }
                return componentName
            },
            onChange (data) {
                this.condition.ConditionFilterValue = data.value
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
