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
                    :dashboardId="dashboardId"
                    :selectedWidgets="selectedWidgets"
                    :summary-actions="getSummaryActions"
                    @select-widget-group="selectWidgetGroup"
                    @select-widget="selectWidget"
                    @go-to-widget-groups="goToWidgetGroups"
                    @add-all-widgets-from-group="addAllWidgetsFromGroup"
                    @dashboard-selected="selectDashboard"
                />
            </fade-transition>
            <template v-slot:footer>
                <div class="border-t-2 border-gray-300 py-4 flex items-center justify-between">
                    <div class="px-6"
                         v-if="componentHasSummary">
                        <p class="text-xs leading-4 text-gray-900 font-bold mb-1">{{ getSummaryActions }}</p>
                    </div>
                    <div class="px-10">
                        <el-button
                            @click="submitWidgets"
                            :disabled="submitDisabled"
                            class="button-set-up-widgets font-bold"
                            type="primary"
                        >
                            {{ $t('general.add') }}
                        </el-button>
                    </div>
                </div>
            </template>
        </modal>
        <ConfirmDialog
            :visible.sync="showConfirmDialog"
            top="18vh"
            @on-close="onCancel"
        >
            <template v-slot:title>
                <h3 class="text-main-2xl font-semibold text-gray-700">
                    {{ $t('report.addWidgetsTitle') }}
                </h3>
            </template>
            <div class="flex justify-center w-full">
                <div class="text-center text-gray-900 text-main-sm leading-21 my-6 max-w-65-p px-3">
                    {{ $tc('report.addWidgetsDesc', selectedWidgets.length, {count: selectedWidgets.length}) }}
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
import Modal from '@/components/Common/Modal'
import WidgetGroups from "@/components/Reports/Widgets/AddWidgetsForm/WidgetGroups"
import WidgetGroupPreview from "@/components/Reports/Widgets/AddWidgetsForm/WidgetGroupPreview";
import DashboardListCard from "@/components/Reports/Widgets/AddWidgetsForm/DashboardListCard";
import ConfirmDialog from '@/components/Common/ConfirmDialog'
import cloneDeep from "lodash/cloneDeep";
import { reportApi } from '@/modules/reports/services/reportService'
import { DashboardApi } from '@/api/dashboardApi'

export default {
    components: {
        Modal,
        WidgetGroups,
        WidgetGroupPreview,
        ConfirmDialog,
        DashboardListCard
    },
    props: {
        modalWidth: {
            type: String,
            default: '1210px',
        },
        widgets: {
            type: Array,
            default: () => []
        },
        transitionDuration: 100,
        visible: {
            type: Boolean,
            default: false
        },
        reportId: {
            type: Number
        },
        doRequest: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            showConfirmDialog: false,
            widgetGroups: [],
            widgetGroup: {},
            selectedWidgets: [],
            step: 'step0',
            steps: {
                'step0': {
                    component: 'DashboardListCard',
                    hasSummary: true
                },
                'step1': {
                    component: 'WidgetGroups',
                    hasSummary: true
                },
                'step2': {
                    component: 'WidgetGroupPreview',
                    hasSummary: true
                }
            },
            dashboardId: null
        }
    },
    computed: {
        attrs() {
            return {
                ...this.$attrs,
                visible: this.visible
            }
        },
        getComponentByStep() {
            this.$nextTick(() => {
                if (this.visible) {
                    document.getElementsByClassName('el-dialog__body')[0].scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                }
            })

            return this.steps[this.step].component
        },
        componentHasSummary() {
            return this.steps[this.step].hasSummary
        },
        getSummaryActions() {
            const widgetsBefore = this.widgets.length
            const widgetsAfter = this.selectedWidgets.length
            return `${this.$t('widget.summary')}: (${this.$t('widget.before')} - ${ widgetsBefore }, ${this.$t('widget.afterAdding')} - ${ widgetsAfter })`
        },
        submitDisabled () {
            return !(this.selectedWidgets.length > 0 && !this.widgets.filter(widget => this.selectedWidgets.indexOf(widget) === -1).length)
        }
    },
    methods: {
        onCloseDialog() {
            this.$emit('update:visible', false)
            this.resetDialog()
        },
        resetDialog() {
            this.selectedWidgets.splice(0, this.selectedWidgets.length)
        },
        onGoToSettings () {
            this.showConfirmDialog = true
        },
        async onConfirm () {
            if (this.doRequest) {
                const selectedWidgets = this.selectedWidgets.map(el => {
                    const data = {
                        ReportID: this.reportId,
                        WidgetID: el
                    }
                    return reportApi.itemUpsert(data)
                })

                await Promise.all(selectedWidgets)
            }
            const activeWidgetItems = this.widgetGroup.WidgetList
                .filter(el => this.selectedWidgets.includes(el.WidgetID))
                .map(el => {
                    delete el.isChecked
                    return el
                })

            this.$emit('added-widgets', {
                activeWidgetItems: activeWidgetItems
            })
            this.showConfirmDialog = false
            this.$emit('update:visible', false)
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
        selectWidget (widgetId, newSelectedStatus = null) {
            const isSelected = newSelectedStatus === null ? this.selectedWidgets.includes(widgetId) : !newSelectedStatus

            // add widget to widgets array
            if (!isSelected) {
                const widgetIndex = this.selectedWidgets.indexOf(widgetId)
                if (widgetIndex === -1) {
                    this.selectedWidgets.push(widgetId)
                }
            } else {
                const widgetIndex = this.selectedWidgets.indexOf(widgetId)
                this.selectedWidgets.splice(widgetIndex, 1)
            }
        },
        addAllWidgetsFromGroup (widgetGroupId) {
            const group = this.widgetGroups.find(group => group.WidgetGroupID === widgetGroupId)
            group.WidgetList.forEach(widget => {
                this.selectWidget(widget.WidgetID, true)
            })
        },
        goToWidgetGroups () {
            const keys = Object.keys(this.steps)
            const currentIndex = keys.indexOf(this.step)
            this.step = keys[currentIndex > 0 ? currentIndex - 1 : 0]
            this.widgetGroup = null
            this.selectedWidgets = []
        },
        submitWidgets () {
            this.showConfirmDialog = true
        },
        async selectDashboard (dashboardId) {
            const widgetGroups = await DashboardApi.find(dashboardId)
            this.widgetGroups = widgetGroups.WidgetGroupList
            this.goToNextStep()
        }
    },
    watch: {
        widgets (newV) {
            this.selectedWidgets = cloneDeep(newV)
        },
        visible (val) {
            if (!val) {
                this.step = 'step0'
            }
        }
    },
    async beforeDestroy () {
        this.resetDialog()
        this.showConfirmDialog = false
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
