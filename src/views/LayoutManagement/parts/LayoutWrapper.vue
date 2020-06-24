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
                    v-bind="group"
                    :key="group.LayoutParameterValueID"
                    :is="group.ParameterTypeName"
                    v-model="group.Value"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import ColorParameterType from '../components/ColorParameterType'
    import IntegerParameterType from '../components/IntegerParameterType'
    import BooleanParameterType from '../components/BooleanParameterType'

    export default {
        inheritAttrs: false,
        components: {
            [ColorParameterType.name]: ColorParameterType,
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
                selectedGroup: 'General',
                layoutGroups: [
                    'General',
                    'Colors',
                    'Timers',
                ],
                groupKeys: {
                    'General': [
                        'ShowWidgetTitles',
                        'FontSize',
                        'WidgetTitlesFontSize',
                        'WidgetGroupTitlesFontSize',
                        'MinRefreshInterval',
                        'RefreshRealTimeDataDelay',
                    ],
                    'Colors': [
                        'ColorPrimary',
                        'ColorBackground',
                        'ColorFrames',
                        'ColorWidgetGroupBackground',
                        'ColorWidgetGroupFrames',
                        'ColorWidgetGroupTitles',
                    ],
                    'Timers': [
                        'ReportInterval',
                        'ReportSwitching',
                        'ReportRefresh'
                    ],
                }
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
            }
        }
    }
</script>
