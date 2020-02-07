<template>
    <div v-if="!loading">
        <label>
            {{model.ParameterPrettyName}}
        </label>
        <base-select class="w-full py-2"
                   filterable
                   :loading="loading"
                   :v-on="$listeners"
                   :collapse-tags="collapseTags"
                   multiple
                   v-model="model.WidgetParameterValue"
                   :data="options"
                   :label-key="templateConfig.label"
                   :value-key="templateConfig.value">
        </base-select>
    </div>
</template>
<script>
    import {Option, Select} from 'element-ui'
    import {getOptionsList, getTemplateConfig} from '@/helpers/entitiesList'

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                loading: true,
                options: [],
                templateConfig: getTemplateConfig(this.model.ParameterID),
                collapseTags: true
            }
        },
        methods: {
            getData() {
                try {
                    this.options = getOptionsList(this.model.ParameterID)
                    this.model.WidgetParameterValue = this.model.WidgetParameterValue.split(',').map(el => {
                        return Number(el);
                    });
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
