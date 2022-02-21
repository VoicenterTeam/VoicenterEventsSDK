<template>
    <div>
        <portal to="form-title">
            {{ $t('widget.allCategories') }}
        </portal>
        <TemplateCategoryCard
            v-for="templatesCategory in getTemplateCategories"
            v-bind="templatesCategory"
            :key="templatesCategory.CategoryID"
            :templates-category="templatesCategory"
        />
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    
    export default {
        components: {
            TemplateCategoryCard: () => import('@/components/Widgets/AddWidgetsForm/TemplateCategoryCard'),
        },
        computed: {
            getTemplateCategories() {
                return cloneDeep(this.$store.state.templatesCategory.all)
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
