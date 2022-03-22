<template>
    <div>
        <modal
            :append-to-body="true"
            v-bind="attrs"
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
                    :widgetGroups="widgetGroups"
                    :submit-disabled="invalidData"
                    :summary-actions="getSummaryActions"
                    @reset-state="resetState"
                    @select-widget-group="selectWidgetGroup"
                    @select-widget="selectWidget"
                    @go-to-widget-groups="goToWidgetGroups"
                />
            </fade-transition>
            <template v-slot:footer>
                <div class="border-t-2 border-gray-300 py-4 flex items-center justify-between"
                     v-if="componentHasSummary">
                    <div class="px-6">
                        <p class="text-xs leading-4 text-gray-900 font-bold mb-1">{{ getSummaryActions }}</p>
                    </div>
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
import Modal from '@/components/Common/Modal'
import WidgetGroups from "@/components/Reports/Widgets/AddWitgetsForm/WidgetGroups"
import WidgetGroupPreview from "@/components/Reports/Widgets/AddWitgetsForm/WidgetGroupPreview";
import ConfirmDialog from '@/components/Common/ConfirmDialog'
import cloneDeep from "lodash/cloneDeep";
import {WidgetGroupsApi} from "@/api/widgetGroupApi";

// import TemplatePreview from '@/components/Widgets/AddWidgetsForm/TemplatePreview'
// import TemplateSummaries from '@/components/Widgets/AddWidgetsForm/TemplateSummaries'
// import TemplateCategories from '@/components/Widgets/AddWidgetsForm/TemplateCategories'
// import TemplatesSettingSetup from '@/components/Widgets/AddWidgetsForm/TemplatesSettingSetup'
// import TemplateCategoryPreview from '@/components/Widgets/AddWidgetsForm/TemplateCategoryPreview'
// import TemplatesEditWidget from '@/components/Widgets/AddWidgetsForm/TemplatesEditWidget'

export default {
    components: {
        Modal,
        WidgetGroups,
        WidgetGroupPreview,
        ConfirmDialog
    },
    props: {
        modalWidth: {
            type: String,
            default: '1210px',
        },
        // widgetGroup: {
        //     type: Object,
        //     default: () => ({}),
        // },
        transitionDuration: 100,
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            showConfirmDialog: false,
            widgetGroups: [],
            widgetGroup: {},
            widgets: [],
            step: 'step0',
            steps: {
                'step0': {
                    component: 'WidgetGroups'
                },
                'step1': {
                    component: 'WidgetGroupPreview',
                    hasSummary: true
                }
            }
        }
    },
    computed: {
        attrs() {
            return {
                ...this.$attrs,
                visible: this.visible
            }
        },
        invalidData() {
            return isEmpty(this.getSummary.summaryText)
        },
        getComponentByStep() {
            //return this.$store.getters['widgetCreation/getComponent']
            return this.steps[this.step].component
        },
        componentHasSummary() {
            // return this.$store.getters['widgetCreation/componentHasSummary']
            return this.steps[this.step].hasSummary
        },
        getQuantities() {
            // return get(this.$store.getters['widgetCreation/getSummaries'], 'quantities')
            const widgetList = get(this.widgetGroup, 'WidgetList', [])
            return widgetList.filter(widget => widget.isChecked)
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
           // return this.$store.getters['widgetCreation/getSummaries']
            return {}
        },
        getSummaryTexts() {
            return get(this.getSummary, 'summaryText')
        },
    },
    methods: {
        onCloseDialog() {
            // this.$store.dispatch('widgetCreation/resetState')
            // this.$store.dispatch('widgetCreation/resetCopyTemplate')
            // this.$store.dispatch('widgetCreation/resetWidgets')
            this.$emit('update:visible', false)
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
            // this.$store.dispatch('widgetCreation/resetState')
            this.$emit('on-submit')
        },
        async onUpdateSummary(summaries) {
            // await this.$store.dispatch('widgetCreation/updateSummaries', summaries)
        },
        onGoToSettings () {
            this.showConfirmDialog = true
        },
        async onConfirm () {
            this.showConfirmDialog = false
            // await this.$store.dispatch('widgetCreation/goToSetupTemplates', false)
        },
        onCancel () {
            this.showConfirmDialog = false
        },
        selectWidgetGroup(group) {
            this.widgetGroup = cloneDeep(group)
            this.goToNextStep()
        },
        goToNextStep() {
            const steps = Object.keys(this.steps)
            const currentStepIndex = Object.keys(this.steps).indexOf(this.step)
            this.step = steps[currentStepIndex + 1]
        },
        async getWidgetGroups() {
            try {
                const currentAccount = 640 // this.$store.state.entities.selectedAccountID
                console.log('currentAccount', currentAccount)
                const {WidgetsGroupsList} = await WidgetGroupsApi.list({
                    AccountID: [currentAccount]
                })
                this.widgetGroups = WidgetsGroupsList
                console.log('widgetGroups', this.widgetGroups)
            } catch (e) {
                console.error(e)
            }
        },
        selectWidget ({ widgetId, value }) {
            console.log('selectWidget')
            console.log('widgetId', widgetId)
            console.log('value', value)
            const widgetList = get(this.widgetGroup, 'WidgetList', [])
            const widget = widgetList.find(widget => widget.WidgetID === widgetId)
            this.$set(widget, 'isChecked', value)
            // add widget to widgets array
            if (value) {
                this.addWidget(widget)
                return
            }
            this.removeWidget(widget)
        },
        addWidget (widget) {

        },
        removeWidget (widget) {

        },
        goToWidgetGroups () {
            this.step = "WidgetGroups"
        }
    },
    async beforeDestroy () {
        this.resetState()
        // await this.$store.dispatch('widgetCreation/resetState')
        // await this.$store.dispatch('widgetCreation/resetCopyTemplate')
        // await this.$store.dispatch('widgetCreation/resetWidgets')
        // await this.$store.dispatch('widgetCreation/resetQuickCreatingWidget')
    },
    created() {
        this.getWidgetGroups()
    },
    mounted() {
        this.$nextTick(() => {
            document.getElementById('componentStep').getElementsByClassName('el-dialog__body')[0].scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        })
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
