<template>
    <div>
        <portal to="redirect-action">
            <span class="text-steel hover:text-primary redirect-action"
                  @click="goToSelectedCategory()">
                  <IconDirLeft class="mx-1"/>
                  {{ $t(templateCategory.CategoryName) }}
            </span>
        </portal>
        <portal to="form-title">
            {{ getTemplate.TemplateName }}
        </portal>
        <template-preview-info :loading="loading" :templateHelp="templateHelp" />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import TemplatePreviewInfo from "@/components/Widgets/AddWidgetsForm/TemplatePreviewInfo";

    export default {
        components: {
            TemplatePreviewInfo
        },
        computed: {
            getTemplate() {
                return this.$store.getters['widgetCreation/getTemplateToPreview']
            },
            templateCategory() {
                return this.$store.getters['widgetCreation/getCategoryTemplates']
            },
        },
        data() {
            return {
                loading: false,
                templateHelp: {},
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
        },
        mounted() {
            this.getHelpByWidgetsTemplateID()
        },
    }
</script>

