<template>
    <div v-if="!loading"
         class="filter-items -mx-2 px-2">
        <el-radio-group class="pb-4" v-model="entityType">
            <el-radio v-for="option in SELECTIONS"
                v-bind="option"
                :key="option.label">
                {{ option.text }}
            </el-radio>
        </el-radio-group>
        <div>
            <div class="flex justify-between w-full">
                <div class="flex items-center">
                    <component class="w-4-5 h-4-5 text-primary"
                        :is="getEntityIcon"/>
                    <span class="mx-1">
                        {{ model.ParameterPrettyName }}
                    </span>
                </div>
                <div
                    class="h-12 flex items-center category-wrapper hover:text-primary cursor-pointer">
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
            <base-select class="w-full py-2"
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
                        label: ENTITY_POSITIVE_KEY,
                        text: this.$t('Include the selected'),
                    },
                    {
                        label: ENTITY_NEGATIVE_KEY,
                        text: this.$t('Exclude the selected'),
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
</style>
