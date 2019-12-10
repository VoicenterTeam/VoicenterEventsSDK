<template>
    <div>
        <label>
            {{data.ParameterPrettyName}}
        </label>
        <el-select class="w-full py-2"
                   filterable
                   :loading="loading"
                   multiple
                   :v-on="$listeners"
                   v-model="data.WidgetParameterValue">
            <el-option v-for="(option, key) in options"
                       :label="option[templateConfig.label]"
                       :value="option[templateConfig.value]"
                       :key="key"/>
        </el-select>
    </div>
</template>
<script>
    import {Option, Select} from 'element-ui'
    import {filters} from '@/enum/widgetTemplateConfigs'

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                loading: false,
                options: [],
                templateConfig: filters[this.data.ParameterID]
            }
        },
        methods: {
            getData() {
                try {
                    this.loading = true;
                    let key = this.templateConfig.EntitiesListKey
                    this.options = this.$store.getters['entities/getEntityList'](key)
                    this.data.WidgetParameterValue.split(',')
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
