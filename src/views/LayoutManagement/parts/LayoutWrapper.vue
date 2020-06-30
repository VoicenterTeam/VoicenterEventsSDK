<template>
    <div class="layout-wrapper" :key="layout.LayoutID">
        <div class="flex flex-row justify-center py-4 border-b">
            <el-button
                v-for="layout in layoutGroups"
                :type="buttonType(layout)"
                @click="selectConfig(layout)">
                {{layout}}
            </el-button>
        </div>
        <div class="">
            <div v-for="group in groupedParameters">
                <component
                    v-if="group.ParameterTypeName !== 'DashboardLogo'"
                    v-bind="group"
                    :key="group.LayoutParameterValueID"
                    :is="group.ParameterTypeName"
                    v-model="group.Value"
                />
                <logo
                    v-else
                    v-bind="group"
                    :key="group.LayoutParameterValueID"
                    v-model="group.ValueText"/>
            </div>
        </div>
    </div>
</template>
<script>
    import ColorParameterType from '../components/ColorParameterType'
    import ImageParameterType from '../components/ImageParameterType'
    import IntegerParameterType from '../components/IntegerParameterType'
    import BooleanParameterType from '../components/BooleanParameterType'
    import {DEFAULT_GROUP_KEYS, DEFAULT_LAYOUT_GROUPS, DEFAULT_SELECTED_GROUP} from '../layout-management'

    export default {
        inheritAttrs: false,
        components: {
            [ColorParameterType.name]: ColorParameterType,
            [ImageParameterType.name]: ImageParameterType,
            [BooleanParameterType.name]: BooleanParameterType,
            [IntegerParameterType.name]: IntegerParameterType,
        },
        props: {
            layout: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                selectedGroup: DEFAULT_SELECTED_GROUP,
                layoutGroups: DEFAULT_LAYOUT_GROUPS,
                groupKeys: DEFAULT_GROUP_KEYS,
            }
        },
        computed: {
            groupedParameters() {
                const group = this.groupKeys[this.selectedGroup]
                return this.layout.LayoutParametersList.filter((el) => group.includes(el.LayoutParameterName))
            }
        },
        methods: {
            selectConfig(config) {
                this.selectedGroup = config
            },
            buttonType(group) {
                if (group === this.selectedGroup) {
                    return 'primary'
                }
            },
        }
    }
</script>
<style lang="scss">
    .rtl {
        .layout-wrapper /deep/ {

            .el-button--primary {
                margin-left: 10px;
            }

            .el-button--default {
                margin-left: 10px;
            }
        }
    }
</style>
