<template>
    <div>
        <portal to="redirect-action">
          <span class="text-steel hover:text-primary redirect-action"
                @click="allSelectedTemplates()">
                <IconDirLeft class="mx-1"/>
                {{ $t('Widgets') }}
            </span>
        </portal>
        <portal to="form-title">
                {{$t('Set up the general widgets settings')}}
        </portal>
        <div class="py-4 -mx-4-5">
            <div v-for="(config, index) in templateConfigs"
                 class="py-4 px-16"
                 :class="{'border-b': templateConfigs.length !== index + 1}">
                <AutoComplete v-if="isAutoCompleteConfig(config)"
                              :key="config.ParameterID"
                              :model="config"/>
                <OtherFilters v-else
                              :key="config.ParameterID"
                              :model="config"/>
            </div>
        </div>
        <portal to="form-footer">
            <div class="px-10">
                <el-button @click="onViewSummary"
                           class="font-bold"
                           type="primary">
                    {{ $t('Next') }}
                </el-button>
            </div>
        </portal>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import uniqBy from 'lodash/uniqBy'
    import orderBy from 'lodash/orderBy'
    import AutoComplete from '@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'
    import OtherFilters from '@/components/Widgets/WidgetUpdateForm/Filters/OtherFilters'

    const AUTO_COMPLETE_TYPE_KEY = 6

    export default {
        components: {
            AutoComplete,
            OtherFilters,
        },
        props: {
            templates: {
                type: Array,
                default: () => [],
            },
            summaryActions: String,
        },
        computed: {
            getTemplatesToSetup() {
                return this.$store.getters['widgetCreation/getTemplatesToSetup']
            },
            getTemplateConfigs() {
                const templatesToSetup = this.getTemplatesToSetup
                const result = Object.values(templatesToSetup)
                return result.map(template => template.DefaultWidgetConfig)
            },
            templateConfigs() {
                let templates = uniqBy(this.getTemplateConfigs, 'ParameterName')
                return orderBy(templates[0], ['ParameterType'], ['desc']);
            },
        },
        methods: {
            isAutoCompleteConfig(config) {
                return config.ParameterType === AUTO_COMPLETE_TYPE_KEY
            },
            async allSelectedTemplates() {
                await this.$store.dispatch('widgetCreation/goToCategory', this.templates)
            },
            async onViewSummary() {
                await this.$store.dispatch('widgetCreation/goToSummary')
            }
        },
    }
</script>
