<template>
    <modal :append-to-body="true"
           v-bind="$attrs"
           v-on="$listeners"
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
                       @on-submit="addWidgetsToGroup"
                       :summary-actions="getSummaryActions"
            />
        </fade-transition>
        <template v-slot:footer>
            <portal-target name="form-footer"/>
        </template>
    </modal>
</template>
<script>
    import Modal from '@/components/Common/Modal'
    import TemplatePreview from '@/components/Widgets/AddWidgetsForm/TemplatePreview'
    import TemplateSummaries from '@/components/Widgets/AddWidgetsForm/TemplateSummaries'
    import TemplateCategories from '@/components/Widgets/AddWidgetsForm/TemplateCategories'
    import TemplatesSettingSetup from '@/components/Widgets/AddWidgetsForm/TemplatesSettingSetup'
    import TemplateCategoryPreview from '@/components/Widgets/AddWidgetsForm/TemplateCategoryPreview'
    import get from 'lodash/get'
    import sum from 'lodash/sum'
    
    export default {
        components: {
            Modal,
            TemplatePreview,
            TemplateSummaries,
            TemplateCategories,
            TemplatesSettingSetup,
            TemplateCategoryPreview,
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
            getComponentByStep() {
                return this.$store.getters['widgetCreation/getComponent']
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
                const newWidgetsCount = this.getQuantities ? sum(Object.values(this.getQuantities)) : 0
                return +newWidgetsCount + +activeWidgets
            },
            getSummaryActions() {
                return `${this.$t('Summary')}: (${this.$t('before')} - ${this.groupWidgetsCount}, ${this.$t('after adding')} - ${this.afterAdding})`
            },
        },
        methods: {
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
            },
        },
    }
</script>
<style lang="scss">
.redirect-action {
    @apply text-sm flex items-center px-6 cursor-pointer;
}
</style>
