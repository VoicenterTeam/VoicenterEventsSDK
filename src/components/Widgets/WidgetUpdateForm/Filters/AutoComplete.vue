<template>
    <div v-if="!loading">
        <label>
            {{model.ParameterPrettyName}}
        </label>
        <el-select class="w-full py-2"
                   filterable
                   :loading="loading"
                   multiple
                   :v-on="$listeners"
                   v-model="model.WidgetParameterValue">
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
            model: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                loading: true,
                options: [],
                templateConfig: filters[this.model.ParameterID],
            }
        },
        methods: {
            getData() {
                try {
                    let key = this.templateConfig.EntitiesListKey
                    this.options = this.$store.getters['entities/getEntityList'](key)
                    this.model.WidgetParameterValue = this.model.WidgetParameterValue.split(',').map(el => {
                        let n = Number(el);
                        return n === 0 ? n : n || el;
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
