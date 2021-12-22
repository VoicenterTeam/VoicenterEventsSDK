<template>
    <modal :append-to-body="true"
           v-bind="$attrs"
           v-on="$listeners"
           @close="onCloseDialog"
           :width="modalWidth">
        <template v-slot:redirect-action>
            <portal-target name="redirect-action"/>
        </template>
        <template v-slot:title>
            <portal-target name="form-title"/>
        </template>
        <template v-slot:additional-action>
            <portal-target name="additional-action"/>
        </template>
        <fade-transition :duration="transitionDuration"
                         mode="out-in">
            <component :is="getComponentByStep"
                       v-on="$listeners"
                       :widgetGroup="widgetGroup"
                       :submit-disabled="invalidData"
                       @on-submit="addWidgetsToGroup"
                       @on-update-summary="onUpdateSummary"
                       :summary-actions="getSummaryActions"
            />
        </fade-transition>
        <template v-slot:footer>
            <div class="border-t-2 border-gray-300 py-4 flex items-center justify-between"
                 v-if="componentHasSummary">
                <div class="px-6">
                    <p class="text-xs leading-4 text-gray-900 font-bold mb-1">{{ getSummaryActions }}</p>
                </div>
                <portal-target name="form-footer"/>
            </div>
        </template>
    </modal>
</template>
<script>
    import get from 'lodash/get'
    import sum from 'lodash/sum'
    import isEmpty from 'lodash/isEmpty'
    import Modal from '@/components/Common/Modal'
    import TemplatePreview from '@/components/Widgets/AddWidgetsForm/TemplatePreview'
    import TemplateSummaries from '@/components/Widgets/AddWidgetsForm/TemplateSummaries'
    import TemplateCategories from '@/components/Widgets/AddWidgetsForm/TemplateCategories'
    import TemplatesSettingSetup from '@/components/Widgets/AddWidgetsForm/TemplatesSettingSetup'
    import TemplateCategoryPreview from '@/components/Widgets/AddWidgetsForm/TemplateCategoryPreview'
    import TemplatesEditWidget from '@/components/Widgets/AddWidgetsForm/TemplatesEditWidget'

    export default {
        components: {
            Modal,
            TemplatePreview,
            TemplateSummaries,
            TemplateCategories,
            TemplatesSettingSetup,
            TemplateCategoryPreview,
            TemplatesEditWidget
        },
        props: {
            modalWidth: {
                type: String,
                default: '50%',
            },
            widgetGroup: {
                type: Object,
                default: () => ({}),
            },
            transitionDuration: 100,
        },
        computed: {
            invalidData() {
                return isEmpty(this.getSummary.summaryText)
            },
            getComponentByStep() {
                return this.$store.getters['widgetCreation/getComponent']
            },
            componentHasSummary() {
                return this.$store.getters['widgetCreation/componentHasSummary']
            },
            getQuantities() {
                return get(this.$store.getters['widgetCreation/getSummaries'], 'quantities')
            },
            groupWidgetsCount() {
                const group = this.widgetGroup
                return get(group, 'WidgetList', []).length
            },
            afterAdding() {
                const activeWidgets = this.groupWidgetsCount || 0
                const newWidgetsCount = this.getQuantities ? sum(Object.values(this.getQuantities || 0)) : 0
                if (newWidgetsCount > 0) {
                    return +newWidgetsCount + +activeWidgets
                }
                return +activeWidgets
            },
            getSummaryActions() {
                return `${this.$t('Summary')}: (${this.$t('before')} - ${this.groupWidgetsCount}, ${this.$t('after adding')} - ${this.afterAdding})`
            },
            getSummary() {
                return this.$store.getters['widgetCreation/getSummaries']
            },
            getSummaryTexts() {
                return get(this.getSummary, 'summaryText')
            },
        },
        methods: {
            onCloseDialog() {
                this.$store.dispatch('widgetCreation/resetState')
            },
            addWidgetsToGroup(templates) {
                const widgetTemplatesToAdd = templates.filter(template => template.toStore)
                const objToEmit = {
                    widgets: widgetTemplatesToAdd,
                    group: this.widgetGroup,
                }

                this.$emit('add-widgets-to-group', objToEmit)
                this.resetState()
            },
            resetState() {
                this.$store.dispatch('widgetCreation/resetState')
                this.$emit('on-submit')
            },
            async onUpdateSummary(summaries) {
                await this.$store.dispatch('widgetCreation/updateSummaries', summaries)
            }
        },
    }
</script>
<style lang="scss">
    .redirect-action {
        @apply text-sm flex items-center px-6 cursor-pointer;
    }
</style>
