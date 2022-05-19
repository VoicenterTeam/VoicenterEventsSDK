<template>
    <div>
        <portal to="redirect-action">
          <span class="text-primary redirect-action"
                @click="goToWidgetGroups">
                <IconDirLeft class="mx-2"/>
                {{ $t('general.back') }}
            </span>
        </portal>
        <portal to="form-title">
            {{ widgetGroupName }}
        </portal>
        <portal to="additional-action">
            <span
                class="mr-2"
            >
                <el-button
                    @click="addAllWidgetsFromWidgetGroup"
                    type="_primary"
                    class="button-add-all"
                >
                    <div class="flex items-center">
                        <IconAdd :class="$rtl.isRTL ? 'ml-1' : 'mr-1'"/>
                        <span
                            class="text-base"
                        >
                            {{ $t('widget.addAll') }}
                        </span>
                    </div>
                </el-button>
            </span>
        </portal>
        <div class="flex justify-center border-b py-4 -mx-4-5">
            <div class="w-full max-w-md">
                <el-input
                    v-model="search"
                    :placeholder="$t('general.search')"
                    class="input-search"
                >
                    <template v-slot:prefix>
                        <i class="el-input__icon vc-icon-search text-primary text-xl" />
                    </template>
                </el-input>
            </div>
        </div>
        <div class="flex flex-col -mx-4-5">
            <div :key="widget.WidgetID"
                 class="w-full"
                 v-for="widget in searchedWidgets">
                <WidgetCard
                    class="w-full"
                    :widget="widget"
                    v-on="$listeners"
                >
                    <template v-slot:template-preview>
                        <el-tooltip :content="$t('widget.templateDictionary')"
                                    :open-delay="openDelay"
                                    class="item"
                                    effect="dark"
                                    placement="top">
                            <div class="flex items-center">
                                <IconInfo
                                    class="cursor-help text-primary"
                                    @click="onWidgetHelp(widget)"
                                />
                                <div class="break-normal ml-2 text-primary">{{ $t('general.help') }}</div>
                            </div>
                        </el-tooltip>
                    </template>
                </WidgetCard>
            </div>
        </div>
    </div>
</template>

<script>
import get from 'lodash/get'
import {InputNumber, Tooltip} from 'element-ui'
import WidgetCard from "@/components/Reports/Widgets/AddWitgetsForm/WidgetCard";

export default {
    components: {
        WidgetCard,
        [Tooltip.name]: Tooltip,
        [InputNumber.name]: InputNumber,
    },
    props: {
        widgetGroup: {
            type: Object,
            default: () => ({}),
        },
        submitDisabled: {
            type: Boolean,
            default: true
        },
        selectedWidgets: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            search: '',
            quantities: {},
            templates: {},
            summaries: {},
            openDelay: 200,
        }
    },
    computed: {
        widgetGroupName () {
            return get(this.widgetGroup, 'WidgetGroupTitle', '')
        },
        widgetList () {
            return get(this.widgetGroup, 'WidgetList', [])
        },
        searchedWidgets () {
            if (!this.search) {
                return this.widgetList
            }
            return this.widgetList.filter(widget => {
                return widget.Title && widget.Title.toLowerCase().includes(this.search.toLowerCase())
            })
        },
    },
    methods: {
        async onWidgetHelp (widget) {
            // some functionality
        },
        async goToWidgetGroups() {
            await this.$emit('go-to-widget-groups')
        },
        addAllWidgetsFromWidgetGroup() {
            this.$emit('add-all-widgets-from-group', this.widgetGroup.WidgetGroupID)
        },
        onWidgetsSelect (selectedWidgets = this.selectedWidgets) {
            const widgetList = get(this.widgetGroup, 'WidgetList', [])
            widgetList.forEach(widget => {
                const isChecked = selectedWidgets.includes(widget.WidgetID)
                this.$set(widget, 'isChecked', isChecked)
            })
        }
    },
    mounted() {
        this.search = ''
        this.onWidgetsSelect()
    },
    watch: {
        selectedWidgets: {
            handler (newV) {
                this.onWidgetsSelect(newV)
            },
            deep: true,
        }
    }
}
</script>

<style lang="scss" scoped>
.widget-menu-footer {
    border-top: solid 1px var(--silver-color);
}

.text-main-xs {
    font-size: 11px;
    color: var(--cool-grey);
}
.button-add-all {
    @apply px-4 py-0.5;
}
.input-search ::v-deep input::placeholder {
    @apply text-gray-500 font-normal text-sm;
}
::v-deep .el-input--prefix .el-input__inner {
    @apply pl-11;
}
::v-deep .el-input__prefix {
    @apply left-4;
}
.button-add-one-widget {
    @apply px-5 py-1 w-22.7 h-7;
}
.button-set-up-widgets {
    @apply px-4-5 py-1.5 text-base;
}
.input-number {
    @apply w-22.7 h-7;
    ::v-deep .el-input-number__decrease, ::v-deep .el-input-number__increase {
        @apply bg-white text-gray-950 font-bold w-6;
        height: 28px;
    }
    ::v-deep .el-input-number__decrease i, ::v-deep .el-input-number__increase i {
        @apply h-full flex justify-center items-center font-bold;
    }
    ::v-deep .el-input input {
        @apply w-22.7 h-7;
    }
}
::v-deep .el-input-number--mini .el-input-number__decrease [class*=el-icon], ::v-deep .el-input-number--mini .el-input-number__increase [class*=el-icon] {
    -webkit-transform: scale(1);
    transform: scale(1);
}
</style>
