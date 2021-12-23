<template>
    <div>
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
                <component
                    :is="getComponentByStep"
                    v-on="$listeners"
                    :widgetGroup="widgetGroup"
                    :submit-disabled="invalidData"
                    @on-submit="addWidgetsToGroup"
                    @on-update-summary="onUpdateSummary"
                    :summary-actions="getSummaryActions"
                    @on-go-to-settings="onGoToSettings"
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
        <ConfirmDialog
            :visible.sync="showConfirmDialog"
            top="18vh"
        >
            <template v-slot:title>
                <h3 class="text-main-2xl font-semibold text-gray-700">
                    {{ $t('Remove changes') }}
                </h3>
            </template>
            <div class="flex justify-center w-full">
                <div class="text-center text-gray-900 text-main-sm leading-21 my-6 max-w-65-p px-3">
                    {{ $t('Do you want to remove changes and go to the settings?') }}
                </div>
            </div>
            <template v-slot:footer-actions>
                <slot name="footer-actions">
                    <base-button
                        @click="onCancel"
                        variant="discard"
                        fixed-width="w-37">
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="mx-1 text-base font-bold">{{ $t('Cancel') }}</span>
                        </div>
                    </base-button>
                    <base-button
                        @click="onConfirm"
                        fixed-width="w-37"
                        key="store"
                    >
                        <span class="mx-1 text-base font-bold">{{ $t('Confirm') }}</span>
                    </base-button>
                </slot>
            </template>
        </ConfirmDialog>
    </div>
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
    import ConfirmDialog from '@/components/Common/ConfirmDialog'

    export default {
        components: {
            Modal,
            TemplatePreview,
            TemplateSummaries,
            TemplateCategories,
            TemplatesSettingSetup,
            TemplateCategoryPreview,
            TemplatesEditWidget,
            ConfirmDialog
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
        data () {
            return {
                showConfirmDialog: false
            }
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
            },
            onGoToSettings () {
                this.showConfirmDialog = true
            },
            async onConfirm () {
                this.showConfirmDialog = false
                await this.$store.dispatch('widgetCreation/goToSetupTemplates', false)
            },
            onCancel () {
                this.showConfirmDialog = false
            }
        },
    }
</script>
<style lang="scss">
    .redirect-action {
        @apply text-sm flex items-center px-6 cursor-pointer;
    }
</style>
