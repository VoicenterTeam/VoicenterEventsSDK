<template>
    <div v-if="!loading"
         class="filter-items -mx-2 px-2">
        <div>
            <div class="flex justify-between w-full">
                <div class="mb-0">
                    <div class="flex items-center pb-4">
                        <i :class="model.ParameterIcon" class="text-primary mx-w-4-5 text-xl" />
                        <span class="mx-2 font-medium text-xl text-gray-950">
                            {{ model.ParameterPrettyName }}
                        </span>
                    </div>
                    <div>
                        <BaseRadioGroup
                            v-model="entityType"
                            :radios="SELECTIONS"
                            class="radio-groups"
                        />
                    </div>
                </div>
                <div
                    v-if="model.ParameterDescription"
                    class="flex items-center category-wrapper hover:text-primary cursor-pointer"
                >
                    <el-tooltip
                        :content="model.ParameterDescription"
                        :open-delay="200"
                        placement="top">
                        <span class="mx-2 truncate">
                            <IconInfo/>
                        </span>
                    </el-tooltip>
                </div>
            </div>
            <base-select
                class="py-2 select"
                filterable
                :loading="loading"
                :v-on="$listeners"
                :collapse-tags="collapseTags"
                multiple
                :value="autocompleteValue"
                @change="onAutocompleteChange"
                :data="options"
                :label-key="templateConfig.label"
                :second-label-key="templateConfig.second_label"
                :value-key="templateConfig.value">
            </base-select>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import { filters } from '@/enum/widgetTemplateConfigs'
    import { Option, Radio, RadioGroup, Select } from 'element-ui'
    import { getOptionsList, getTemplateConfig } from '@/helpers/entitiesList'

    const ENTITY_POSITIVE_KEY = 'EntityPositive'
    const ENTITY_NEGATIVE_KEY = 'EntityNegative'

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
        },
        props: {
            model: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                options: [],
                loading: true,
                collapseTags: true,
                templateConfig: getTemplateConfig(this.model.ParameterName),
                SELECTIONS: [
                    {
                        value: ENTITY_POSITIVE_KEY,
                        label: this.$t('Include the selected'),
                    },
                    {
                        value: ENTITY_NEGATIVE_KEY,
                        label: this.$t('Exclude the selected'),
                    },
                ],
                entityType: ENTITY_POSITIVE_KEY,
            }
        },
        computed: {
            autocompleteValue() {
                if (this.model.WidgetParameterJson === 1) {
                    return get(this.model.WidgetParameterValueJson, this.entityType, [])
                } else {
                    return get(JSON.parse(this.model.WidgetParameterValue), this.entityType, [])
                }
            },
            getEntityIcon() {
                return filters[this.model.ParameterName.toLowerCase()].icon
            },
        },
        methods: {
            get,
            getData() {
                this.options = getOptionsList(this.model.ParameterName)

                this.loading = false
            },
            onAutocompleteChange(value) {
                if (this.model.WidgetParameterJson === 1) {
                    this.model.WidgetParameterValueJson[this.entityType] = cloneDeep(value)
                } else {
                    const currentValue = JSON.parse(this.model.WidgetParameterValue)
                    currentValue[this.entityType] = cloneDeep(value)

                    this.model.WidgetParameterValue = JSON.stringify(value)
                }
            },
        },
        mounted() {
            this.getData()
        },
    }
</script>
<style lang="scss" scoped>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    color: var(--primary-color);
}

.filter-items:not(:last-child) {
    @apply mb-4 border-b;
}
.radio-groups {
    @apply flex;
}
.radio-groups ::v-deep .vc-form-radio:last-child {
    @apply ml-8;
}
.select ::v-deep input::placeholder {
    @apply text-gray-500 font-normal text-sm;
}
.select, .select ::v-deep .el-select>.el-input {
    @apply w-100;
}
</style>
