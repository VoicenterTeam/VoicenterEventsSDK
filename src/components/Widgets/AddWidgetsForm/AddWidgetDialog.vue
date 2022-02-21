<template>
    <div>
        <modal
            :append-to-body="true"
            v-bind="$attrs"
            v-on="$listeners"
            @close="onCloseDialog"
            :width="modalWidth"
            id="componentStep"
            top="50px">
            <template v-slot:redirect-action>
                <portal-target name="redirect-action"/>
            </template>
            <template v-slot:title>
                <span class="form-title">
                    <portal-target name="form-title"/>
                </span>
            </template>
            <template v-slot:additional-action>
                <portal-target name="additional-action"/>
            </template>
            <fade-transition
                :duration="transitionDuration"
                mode="out-in"
            >
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
                    {{ $t('widget.removeChanges') }}
                </h3>
            </template>
            <div class="flex justify-center w-full">
                <div class="text-center text-gray-900 text-main-sm leading-21 my-6 max-w-65-p px-3">
                    {{ $t('widget.doYouWantToRemoveChangesAndGoToTheSettings') }}
                </div>
            </div>
            <template v-slot:footer-actions>
                <slot name="footer-actions">
                    <base-button
                        outline
                        fixed-width="w-32"
                        @click="onCancel">
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="mx-1 text-base font-bold">{{ $t('common.cancel') }}</span>
                        </div>
                    </base-button>
                    <base-button
                        type="primary"
                        @click="onConfirm"
                        fixed-width="w-32"
                        key="store"
                    >
                        <span class="mx-1 text-base font-bold">{{ $t('common.confirm') }}</span>
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

    export default {
        components: {
            Modal: () => import('@/components/Common/Modal'),
            TemplatePreview: () => import('@/components/Widgets/AddWidgetsForm/TemplatePreview'),
            TemplateSummaries: () => import('@/components/Widgets/AddWidgetsForm/TemplateSummaries'),
            TemplateCategories: () => import('@/components/Widgets/AddWidgetsForm/TemplateCategories'),
            TemplatesSettingSetup: () => import('@/components/Widgets/AddWidgetsForm/TemplatesSettingSetup'),
            TemplateCategoryPreview: () => import('@/components/Widgets/AddWidgetsForm/TemplateCategoryPreview'),
            TemplatesEditWidget: () => import('@/components/Widgets/AddWidgetsForm/TemplatesEditWidget'),
            ConfirmDialog: () => import('@/components/Common/ConfirmDialog')
        },
        props: {
            modalWidth: {
                type: String,
                default: '1210px',
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
                this.$nextTick(() => {
                    document.getElementById('componentStep').getElementsByClassName('el-dialog__body')[0].scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                })
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
                return `${this.$t('widget.summary')}: (${this.$t('widget.before')} - ${this.groupWidgetsCount}, ${this.$t('widget.afterAdding')} - ${this.afterAdding})`
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
                this.$store.dispatch('widgetCreation/resetCopyTemplate')
                this.$store.dispatch('widgetCreation/resetWidgets')
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
        async beforeDestroy () {
            await this.$store.dispatch('widgetCreation/resetState')
            await this.$store.dispatch('widgetCreation/resetCopyTemplate')
            await this.$store.dispatch('widgetCreation/resetWidgets')
            await this.$store.dispatch('widgetCreation/resetQuickCreatingWidget')
        }
    }
</script>
<style lang="scss">
    .redirect-action {
        @apply text-sm flex items-center px-8 cursor-pointer;
    }
    .form-title {
        @apply text-gray-950 font-bold text-xl;
    }
</style>
