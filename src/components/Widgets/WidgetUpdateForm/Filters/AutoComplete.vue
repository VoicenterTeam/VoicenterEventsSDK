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
                         v-model="model.WidgetParameterValue[entityType]"
                         :data="options"
                         :label-key="templateConfig.label"
                         :value-key="templateConfig.value">
            </base-select>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Option, Radio, RadioGroup, Select} from 'element-ui'
    import {getOptionsList, getTemplateConfig} from '@/helpers/entitiesList'

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
                templateConfig: getTemplateConfig(this.model.ParameterID),
                SELECTIONS: [
                    {
                        label: 'EntityPositive',
                        text: this.$t('Include the selected'),
                    },
                    {
                        label: 'EntityNegative',
                        text: this.$t('Exclude the selected'),
                    },
                ],
                entityType: 'EntityPositive',
            }
        },
        methods: {
            get,
            getData() {
                try {
                    this.options = getOptionsList(this.model.ParameterID)
                    if (typeof this.model.WidgetParameterValue === 'string') {
                        this.model.WidgetParameterValue = JSON.parse(this.model.WidgetParameterValue) || {}
                    }
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                }
            },
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
