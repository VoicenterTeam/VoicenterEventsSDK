<template>
    <el-collapse v-model="activeCollapse" class="pt-4">
        <el-collapse-item :title="$t('settings.time.frame')" name="filters">
            <el-select class="select-primary w-100"
                       filterable
                       :loading="loading"
                       multiple
                       v-bind="$attrs"
                       v-on="listeners"
                       :placeholder="$t('autocomplete.select.label.user')">
                <el-option v-for="(option, key) in options"
                           class="select-primary"
                           :key="key"
                           :label="option.UserName"
                           :value="option.UserID"/>
            </el-select>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
    import {WidgetFiltersApi} from '@/api/widgetFiltersApi'
    import {Select, Option} from 'element-ui'

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                activeCollapse: 'filters',
                loading: false,
                options: [],
            }
        },
        methods: {
            async getData() {
                try {
                    this.loading = true;
                    let {data} = await WidgetFiltersApi.getAutocompletes('/User/List/');
                    this.options = data.Data
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                }
            },
            async onFocus() {
                await this.getData()
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    focus: this.onFocus
                }
            },
            filterType() {

            },
            filterEndPoint() {

            },
        },
        mounted() {
            //
        },
    }
</script>
<style lang="scss" scoped>

</style>
