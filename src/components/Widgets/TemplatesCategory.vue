<template>
    <div class="p-4 shadow absolute max-w-xl bg-white z-10 widget-menu pb-2" @click.stop>
        <p class="text-center pb-2" v-if="!selectedCategory">{{$t('select.templates.category')}}</p>
        <div v-if="selectedCategory">
            <el-tooltip class="item" effect="dark" :content="$t('select.another.templates.category')" placement="top">
                <templates-category-card
                        v-bind="selectedCategory"
                        :templatesCategory="selectedCategory"
                        @on-select="onSelect(null)">
                    <template v-slot:state-icon>
                        <XIcon class="w-5 h-5 text-red ml-auto"></XIcon>
                    </template>
                </templates-category-card>
            </el-tooltip>
        </div>
        <div v-else>
            <templates-category-card
                    v-for="templatesCategory in templatesCategories"
                    v-bind="templatesCategory"
                    :templatesCategory="templatesCategory"
                    @on-select="onSelect">
                <template v-slot:state-icon></template>
            </templates-category-card>
        </div>
        <widget-menu
                v-if="selectedCategory"
                v-on="$listeners"
                v-bind="$attrs"
                :widgetTemplates="filteredWidgetTemplates">
        </widget-menu>
    </div>
</template>
<script>
    import {XIcon} from 'vue-feather-icons'
    import {Select, Option, Tooltip} from 'element-ui'
    import WidgetMenu from './WidgetMenu'
    import TemplatesCategoryCard from "./TemplatesCategoryCard";

    export default {
        components: {
            XIcon,
            WidgetMenu,
            TemplatesCategoryCard,
            [Select.name]: Select,
            [Option.name]: Option,
            [Tooltip.name]: Tooltip,
        },
        data() {
            return {
                selectedCategory: null,
            }
        },
        props: {
            widgetTemplates: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            templatesCategories() {
                return this.$store.state.templatesCategory.all
            },
            filteredWidgetTemplates() {
                return this.widgetTemplates.filter((template) => template.DataType.ID === this.selectedCategory.ID)
            }
        },
        methods: {
            onSelect(category) {
                this.selectedCategory = category
            }
        }
    }
</script>
<style>
    .widget-menu {
        width: 275px;
        border-radius: 4px;
        box-shadow: 0 0 22px 0 rgba(42, 44, 54, 0.19);
    }
</style>
