<template>
    <div>
        <portal to="redirect-action">
            <span
                class="text-primary redirect-action"
                @click="goToSelectedCategory()"
            >
                <IconDirLeft class="mx-1"/>
                {{ $t(templateCategory.CategoryName) }}
            </span>
        </portal>
        <portal to="form-title">
            {{ getTemplate.template.TemplateName }}
        </portal>
        <portal to="additional-action">
            <span
                class="mr-2"
            >
                <el-button
                    @click="addWidgetToCategory(getTemplate.template)"
                    type="_primary"
                    class="button-add-all"
                    v-if="!isWidgetAdded && !hideBtn"
                >
                    <div class="flex items-center">
                        <IconAdd :class="$rtl.isRTL ? 'ml-1' : 'mr-1'"/>
                        <span
                            class="text-sm"
                        >
                            {{ $t('dashboard.addWidget') }}
                        </span>
                    </div>
                </el-button>
            </span>
        </portal>
        <template-preview-info :loading="loading" :templateHelp="templateHelp" />
        <portal to="form-footer">
            <div class="px-10" v-if="!isWidgetAdded">
                <el-button @click="finish"
                           class="font-bold btn-finish"
                           type="primary">
                    {{ $t('general.finish') }}
                </el-button>
            </div>
        </portal>
    </div>
</template>
<script>
    import get from 'lodash/get'

    export default {
        components: {
            TemplatePreviewInfo: () => import("@/components/Widgets/AddWidgetsForm/TemplatePreviewInfo")
        },
        computed: {
            getTemplate() {
                return this.$store.getters['widgetCreation/getTemplateToPreview']
            },
            templateCategory() {
                return this.$store.getters['widgetCreation/getCategoryTemplates']
            },
            isWidgetAdded () {
                const activeWidget = this.templateCategory.TemplatesList.find(el => Number(el.TemplateID) === Number(this.getTemplate.template.TemplateID))
                return activeWidget.quantity
            }
        },
        data() {
            return {
                loading: false,
                templateHelp: {},
                hideBtn: false
            }
        },
        methods: {
            async goToSelectedCategory() {
                await this.$store.dispatch('widgetCreation/goToCategory')
            },
            getHelpByWidgetsTemplateID() {
                const helpData = this.$store.getters['templatesCategory/getHelpByWidgetsTemplateID'](this.getTemplate.template.TemplateID)

                this.templateHelp = get(helpData, 'Help', {})
            },
            addWidgetToCategory () {
                this.hideBtn = true
            },
            async finish () {
                if (this.hideBtn) {
                   this.$set(this.getTemplate.template, 'quantity', 1)
                   await this.goToSelectedCategory()
                }
            }
        },
        mounted() {
            this.getHelpByWidgetsTemplateID()
        },
    }
</script>

<style lang="scss" scoped>
.button-add-all {
    @apply px-5 py-1;
}
.btn-finish {
    @apply text-base px-10 py-1.5;
}
</style>
