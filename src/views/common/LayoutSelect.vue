<template>
    <div class="w-full relative layout-selection">
        <div class="flex items-center mb-3"
             v-if="displayLabel">
            <IconLayoutSelection class="text-primary"/>
            <div class="mx-1 text-gray-900 text-sm font-medium truncate">
                {{ $t('Layout Selection') }}
            </div>
        </div>
        <el-select v-model="selectedLayout"
                   value-key="LayoutID"
                   label-key="LayoutName"
                   placeholder=" "
                   :filterable="filterable"
                   class="layout-select flex items-center text-sm font-medium w-full"
        >
            <div class="options-wrapper">
                <el-option v-for="layout in filteredLayouts"
                           class="flex items-center justify-between"
                           :value="layout.LayoutID"
                           :label="layout.LayoutName"
                           :key="layout.LayoutID">
                    <div
                        class="truncate flex justify-between h-13 shadow-base w-full px-2 rounded border border-transparent hover:border-primary">
                        <div @click="onChooseLayout(layout)"
                             class="flex flex-col flex-1">
                            <p class="-mt-1 text-md truncate">{{ layout.LayoutName }}</p>
                            <div class="flex w-full flex-row pb-2 items-center">
                                <div v-for="group in getColorParameters(layout)"
                                     class="w-1/3 h-2"
                                     :key="group.JPath">
                                    <div class="w-full h-2 rounded border"
                                         :style="getIndicatorStyles(group)"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-option>
            </div>
        </el-select>
    </div>
</template>
<script>
    import { Option, Select } from 'element-ui'
    import { DEFAULT_GROUP_KEYS } from '@/views/DashboardSettings/LayoutManagement/layout-management'
    
    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            activeLayout: {
                type: Object,
                default: () => ({}),
            },
            displayLabel: {
                type: Boolean,
                default: true,
            },
            filterable: {
                type: Boolean,
                default: true,
            },
            hideLayoutId: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                groupKeys: DEFAULT_GROUP_KEYS,
                selectedLayout: null,
            }
        },
        computed: {
            activeAccountLayouts() {
                return this.$store.getters['layout/getActiveLayouts']
            },
            filteredLayouts() {
                console.log('fdsf', this.hideLayoutId)
                if (!this.hideLayoutId) {
                    return this.activeAccountLayouts
                }
                const result = this.activeAccountLayouts.filter(layout => layout.LayoutID.toString() !== this.hideLayoutId.toString())
                return result
            }
        },
        methods: {
            onChooseLayout(layout) {
                this.selectedLayout = layout
                this.$emit('on-chose-layout', layout)
            },
            getIndicatorStyles(config) {
                return {
                    'background-color': config.Value,
                }
            },
            getColorParameters(layout) {
                if (!layout) {
                    return []
                }
                const group = this.groupKeys['Colors']
                return this.getGroupedParameters(group, layout)
            },
            getGroupedParameters(group, layout) {
                return layout.LayoutParametersList.filter((el) => group.includes(el.LayoutParameterName))
            },
        },
        watch: {
            activeLayout(layout) {
                this.selectedLayout = layout.LayoutID
            },
        },
    }
</script>
<style lang="scss" scoped>
.el-select-dropdown {
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    
    .el-select-dropdown__item {
        @apply h-14 my-2;
        &.hover {
            @apply bg-white;
        }
    }
    
    overflow: hidden;
}
</style>
