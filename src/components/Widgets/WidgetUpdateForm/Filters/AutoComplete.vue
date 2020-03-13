<template>
    <div v-if="!loading">
        <el-radio-group class="pb-4" v-model="entityType">
            <el-radio v-for="option in SELECTIONS"
                      v-bind="option"
                      :key="option.label">
                {{option.text}}
            </el-radio>
        </el-radio-group>
        <div>
            <label>
                {{model.ParameterPrettyName}}
            </label>
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
                         :value-key="templateConfig.value">
            </base-select>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import {Option, Radio, RadioGroup, Select} from 'element-ui'
    import {getOptionsList, getTemplateConfig} from '@/helpers/entitiesList'

    const ENTITY_POSITIVE_KEY = 'EntityPositive'
    const ENTITY_NEGATIVE_KEY = 'EntityNegative'
    const defaultParameterJson = {
        EntityPositive: [],
        EntityNegative: [],
        AccountList: []
    }
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
                default: () => ({})
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
                if (this.model.WidgetParameterValueJson) {
                    return this.model.WidgetParameterValueJson[this.entityType]
                }
                return get(this.model.WidgetParameterValue, this.entityType, [])
            }
        },
        methods: {
            get,
            getData() {
                try {
                    this.options = getOptionsList(this.model.ParameterName)
                    if (typeof this.model.WidgetParameterValue === 'string') {
                        this.model.WidgetParameterValue = JSON.parse(this.model.WidgetParameterValue) || {}
                    }
                    if (!this.model.WidgetParameterValueJson) {
                        this.$set(this.model, 'WidgetParameterValueJson', cloneDeep(defaultParameterJson))
                    }
                } catch (e) {
                    if (!this.model.WidgetParameterValueJson) {
                        this.$set(this.model, 'WidgetParameterValueJson', cloneDeep(defaultParameterJson))
                    }
                    console.warn(e)
                } finally {
                    this.loading = false
                }
            },
            onAutocompleteChange(value) {
                if (!this.model.WidgetParameterValueJson) {
                    this.$set(this.model, 'WidgetParameterValueJson', cloneDeep(defaultParameterJson))
                }
                this.model.WidgetParameterValueJson[this.entityType] = cloneDeep(value)
            }
        },
        mounted() {
            this.getData()
        }
    }
</script>
<style lang="scss" scoped>
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
        color: var(--primary-color);
    }
</style>
