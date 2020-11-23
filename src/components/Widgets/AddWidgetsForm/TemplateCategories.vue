<template>
    <div>
        <portal to="form-title">
            {{ $t('All Categories') }}
        </portal>
        <TemplateCategoryCard v-for="templatesCategory in getTemplateCategories"
                              v-bind="templatesCategory"
                              :key="templatesCategory.CategoryID"
                              :templates-category="templatesCategory"
        />
    </div>
</template>
<script>
    import TemplateCategoryCard from '@/components/Widgets/AddWidgetsForm/TemplateCategoryCard'
    
    export default {
        components: {
            TemplateCategoryCard,
        },
        computed: {
            getTemplateCategories() {
                return this.$store.state.templatesCategory.all
            },
        },
        methods: {
            async resetState() {
                await this.$store.dispatch('widgetCreation/resetState')
            },
        },
        mounted() {
            this.resetState()
        },
    }
</script>
