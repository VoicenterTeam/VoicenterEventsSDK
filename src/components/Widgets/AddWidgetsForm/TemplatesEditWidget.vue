<template>
    <div>
        <portal to="redirect-action">
            <span class="text-steel hover:text-primary redirect-action"
                @click="goToSummary()">
                <IconDirLeft class="mx-1"/>
                {{ $t('Summary') }}
            </span>
        </portal>
        <portal to="form-title">
            {{$t('Set up the widget settings')}}
        </portal>
        <div class="py-4 -mx-4-5">
            <div v-for="(config, index) in uniqTemplatesConfigs"
                :key="index"
                class="py-4 px-16"
                :class="{'border-b': uniqTemplatesConfigs.length !== index + 1}">
                <AutoComplete
                    v-if="isAutoCompleteConfig(config)"
                    :key="`auto-complete-${config.ParameterID}`"
                    :model="config"
                />
                <OtherFilters
                    v-else
                    :key="`other-filters-${config.ParameterID}`"
                    :model="config"
                />
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
    import orderBy from 'lodash/orderBy'
    import AutoComplete from '@/components/Widgets/WidgetUpdateForm/Filters/AutoComplete'
    import OtherFilters from '@/components/Widgets/WidgetUpdateForm/Filters/OtherFilters'
    import cloneDeep from 'lodash/cloneDeep'
    import ENUM from '@/enum/parameters'

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
        data () {
            return {
                uniqTemplatesConfigs: [],
                templateConfigs: []
            }
        },
        computed: {
            getTemplateToEdit() {
                return this.$store.getters['widgetCreation/getTemplateToEdit']
            },
        },
        async mounted () {
            await this.createUniqTemplateConfigs()
        },
        methods: {
            isAutoCompleteConfig(config) {
                return config.ParameterType === ENUM.AUTO_COMPLETE_TYPE_KEY
            },
            async goToSummary() {
                const data = {
                    template: this.uniqTemplatesConfigs,
                    templateID: this.getTemplateToEdit.TemplateID
                }
                await this.$store.dispatch('widgetCreation/updateTemplate', data)
                await this.$store.dispatch('widgetCreation/goToSummary')
            },
            async onViewSummary() {
                await this.goToSummary()
            },
            async createUniqTemplateConfigs () {
                const editMode = cloneDeep(this.getTemplateToEdit)
                let templates = []

                if (editMode && Object.keys(editMode).length) {
                    templates = orderBy(editMode.DefaultWidgetConfig, ['ParameterType'], ['desc'])
                }

                this.uniqTemplatesConfigs = templates
            }
        }
    }
</script>
