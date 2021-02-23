<template>
    <div class="layout-wrapper"
         v-if="value.LayoutID"
         :key="value.LayoutID">
        <CollapseWrapper v-for="setting in settings"
                         class="mb-3"
                         :key="setting.key"
                         v-bind="setting">
            <div v-for="group in groupedParameters(setting.group)">
                <component v-if="group.ParameterTypeName !== 'DashboardLogo'"
                           v-bind="group"
                           :key="group.LayoutParameterValueID"
                           :is="group.ParameterTypeName"
                           v-model="group.Value"
                />
                <logo v-else
                      v-bind="group"
                      :key="group.LayoutParameterValueID"
                      v-model="group.ValueText"/>
            </div>
        </CollapseWrapper>
    </div>
</template>
<script>
    import {mapOrder} from '@/helpers/util'
    import CollapseWrapper from '@/views/common/CollapseWrapper'
    import ColorParameterType from '../components/ColorParameterType'
    import ImageParameterType from '../components/ImageParameterType'
    import IntegerParameterType from '../components/IntegerParameterType'
    import BooleanParameterType from '../components/BooleanParameterType'
    import {DEFAULT_GROUP_KEYS, DEFAULT_LAYOUT_GROUPS, DEFAULT_SELECTED_GROUP} from '../layout-management'

    export default {
        inheritAttrs: false,
        components: {
            CollapseWrapper,
            [ColorParameterType.name]: ColorParameterType,
            [ImageParameterType.name]: ImageParameterType,
            [BooleanParameterType.name]: BooleanParameterType,
            [IntegerParameterType.name]: IntegerParameterType,
        },
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                selectedGroup: DEFAULT_SELECTED_GROUP,
                layoutGroups: DEFAULT_LAYOUT_GROUPS,
                groupKeys: DEFAULT_GROUP_KEYS,
                settings: [{
                    key: 1,
                    title: 'Color Settings',
                    icon: 'IconColorSettings',
                    group: 'AllColors',
                }, {
                    key: 2,
                    title: 'Text Settings',
                    icon: 'IconTextSettings',
                    group: 'Fonts',
                }, {
                    key: 3,
                    title: 'Timer Settings',
                    icon: 'IconTimerSettings',
                    group: 'Timers',
                }],
            }
        },
        methods: {
            groupedParameters(section) {
                const group = this.groupKeys[section]
                const settings = this.value.LayoutParametersList.filter((el) => group.includes(el.LayoutParameterName))
                return mapOrder(settings, group, 'LayoutParameterName')
            },
            selectConfig(config) {
                this.selectedGroup = config
            },
            buttonType(group) {
                if (group === this.selectedGroup) {
                    return 'primary'
                }
            },
        },
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
