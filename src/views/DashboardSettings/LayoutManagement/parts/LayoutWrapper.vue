<template>
    <div class="layout-wrapper"
         v-if="value.LayoutID"
         :key="value.LayoutID">
        <CollapseWrapper
            v-for="setting in settings"
            class="mb-3"
            :key="setting.key"
            v-bind="setting"
        >
            <div v-for="group in groupedParameters(setting.group)" :key="group.LayoutParameterValueID">
                <component
                    v-if="group.ParameterTypeName !== 'DashboardLogo'"
                    v-bind="group"
                    :is="group.ParameterTypeName"
                    v-model="group.Value"
                />
                <logo v-else
                      v-bind="group"
                      v-model="group.ValueText"/>
            </div>
        </CollapseWrapper>
    </div>
</template>
<script>
    import { mapOrder } from '@/helpers/util'
    import ColorParameterType from '../components/ColorParameterType'
    import ImageParameterType from '../components/ImageParameterType'
    import IntegerParameterType from '../components/IntegerParameterType'
    import BooleanParameterType from '../components/BooleanParameterType'
    import { DEFAULT_GROUP_KEYS } from '../layout-management'

    export default {
        inheritAttrs: false,
        components: {
            CollapseWrapper: () => import('@/views/common/CollapseWrapper'),
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
                groupKeys: DEFAULT_GROUP_KEYS,
                settings: [
                    {
                        key: 1,
                        title: 'Color Settings',
                        icon: 'IconColorSettings',
                        group: 'AllColors',
                    },
                    {
                        key: 2,
                        title: 'Text Settings',
                        icon: 'IconTextSettings',
                        group: 'Fonts',
                    },
                    {
                        key: 3,
                        title: 'Timer Settings',
                        icon: 'IconTimerSettings',
                        group: 'Timers',
                    },
                ],
            }
        },
        methods: {
            groupedParameters(section) {
                const group = this.groupKeys[section]
                const settings = this.value.LayoutParametersList
                    .filter((el) => group.includes(el.LayoutParameterName) && el.LayoutParameterName !== 'ColorWidgetGroupFrames' && el.LayoutParameterName !== 'ColorWidgetGroupBackground')
                // TODO: need to add opportunities to change keys: ColorWidgetGroupFrames, ColorWidgetGroupBackground
                return mapOrder(settings, group, 'LayoutParameterName')
            }
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
