<template>
    <div>
        <modal
            :append-to-body="true"
            v-bind="attrs"
            v-on="$listeners"
            @close="onCloseDialog"
            :width="modalWidth"
            id="componentStep"
            top="50px"
            titleCentered
        >
            <template v-slot:title>
                <span class="form-title">
                    {{ $t('widget.widgetReorder') }}
                </span>
            </template>
            <fade-transition
                :duration="transitionDuration"
                mode="out-in"
            >
                <tab-card
                    :data="dataReportExport"
                    :active-tab.sync="activeTab"
                    class="border-t md:border-0 mt-7 px-10"
                    data-test-name="report-item--edit"
                    :white-bg="true"
                >
                    <template v-for="(dynamicTab, index) in dataReportExport" :slot="dynamicTab.name">
                        <draggable-list
                            v-if="dynamicTab.reportItemExport.length"
                            :value="widgets"
                            @change="(ev) => onGroupListChange(ev, dynamicTab)"
                            group="widgets"
                            :key="index"
                        >
                            <div
                                v-for="(widgetItem, index) in dynamicTab.reportItemExport"
                                :key="index"
                                class="w-full flex justify-between items-center items py-4 px-8 border-b"
                            >
                                <div class="widget-item flex justify-center">
                                    <span class="font-bold mr-12 text-xl min-w-5 flex items-center justify-center">
                                        {{ index + 1 }}
                                    </span>
                                    <div class="flex flex-col">
                                        <span class="text-gray-950 text-xl">
                                            {{ widgetItem.WidgetTitle }}
                                        </span>
                                        <span v-if="checkIfExistReportItemDescription(widgetItem.ReportItemDescription)">
                                            {{ widgetItem.ReportItemDescription }}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex cursor-pointer items-center justify-center">
                                    <i class="vc-icon-recycle-bin text-xl text-red mr-6" @click="deleteWidget" />
                                    <icon-drag-and-drop v-if="dynamicTab.reportItemExport.length > 1" class="text-gray-500 hover:text-primary"/>
                                </div>
                            </div>
                        </draggable-list>
                        <div v-else :key="`empty-data-${index}`" class="no-data-block"> 
                            <h3 class="text-main-xl">{{ $t('general.noData') }}</h3>
                        </div>
                    </template>
                </tab-card>
            </fade-transition>
            <template v-slot:footer>
                <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-end">
                    <el-button
                        @click="submitWidgets"
                        class="button-set-up-widgets font-bold"
                        type="primary"
                    >
                        {{ $t('general.add') }}
                    </el-button>
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
import ConfirmDialog from '@/components/Common/ConfirmDialog'
import draggableEvents from '@/enum/draggableEvents'
import { reportApi } from '@/modules/reports/services/reportService'

export default {
    components: {
        Modal,
        ConfirmDialog,
        TabCard: () => import('@/modules/reports/components/TabCard.vue'),
        DraggableList: () => import('@/components/Widgets/DraggableList')
    },
    props: {
        modalWidth: {
            type: String,
            default: '1210px'
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
            type: [Number, String],
            default: ''
        },
        widgets: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            showConfirmDialog: false,
            dataReportExport: [],
            activeTab: null
        }
    },
    computed: {
        attrs() {
            return {
                ...this.$attrs,
                visible: this.visible
            }
        },
        confData () {
            return this.$store.getters['reportTrigger/getConfData']
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.makeReorderWidgetData()
                this.setActiveTab()
            }
        }
    },
    methods: {
        onCloseDialog() {
            this.$emit('update:visible', false)
        },
        async onConfirm () {
            const reportItemExport = this.dataReportExport
                .filter(el => el.reportItemExport.length)
                .map(el => {
                    return el.reportItemExport
                })[0]
                .map(el => {
                    return el.ReportItemExport
                })
                .flat()
            const payload = {
                ReportItemExportList: [
                    ...reportItemExport
                ]
            }

            await reportApi.reportItemExportReorder(payload)
            this.showConfirmDialog = false
            this.$emit('update:visible', false)
            this.$emit('reordered-widgets', this.dataReportExport)
        },
        onCancel () {
            this.showConfirmDialog = false
        },
        submitWidgets () {
            this.showConfirmDialog = true
        },
        onGroupListChange (ev, dynamicTab) {
            let eventData = ev[draggableEvents.MOVED]
            let { newIndex: newIndex, oldIndex: oldIndex } = eventData
            dynamicTab.reportItemExport.splice(newIndex, 0, dynamicTab.reportItemExport.splice(oldIndex, 1)[0])
            dynamicTab.reportItemExport.forEach((el, index) => {
                el.ReportItemExport.map(item => {
                    item.ReportExportOrder = index + 1
                    return item
                })
            })
        },
        deleteWidget () {
            console.log('delete widget')
        },
        makeReorderWidgetData () {
            const data = []
            this.confData.ReportExportTypeList.forEach(el => {
                data.push({
                    reportItemExport: [],
                    ...el,
                    title: this.$t(el.ReportExportTypeNameContentTag),
                    name: String(el.ReportExportTypeName).toLowerCase().replaceAll(' ', '_'),
                    icon:'vc-icon-rd',
                    disabled: false
                })

                this.widgets.forEach(widgetItem => {
                    const reportItemExport = widgetItem.ReportItemExport.filter(item => +item.ReportExportTypeID === +el.ReportExportTypeID)
                    if (reportItemExport.length) {
                        const sameTab = data.find(dataItem => +dataItem.ReportExportTypeID === +el.ReportExportTypeID)
                        sameTab.reportItemExport.push({
                            ...widgetItem,
                            ...reportItemExport
                        })
                    }
                })
            })

            data.map(el => {
                el.disabled = !el.reportItemExport.length
                return el
            })

            this.dataReportExport = data
        },
        setActiveTab () {
            if (this.dataReportExport && this.dataReportExport.length) {
                const allNotEmptyDataInTab = this.dataReportExport.filter(el => el.reportItemExport.length)
                this.activeTab = allNotEmptyDataInTab[0].name
            }  
        },
        checkIfExistReportItemDescription (description) {
            return description && description !== '{}' ? description : ''
        }
    },
    async beforeDestroy () {
        this.showConfirmDialog = false
    }
}
</script>

<style lang="scss" scoped>
.redirect-action {
    @apply text-sm flex items-center px-8 cursor-pointer;
}
.form-title {
    @apply text-gray-950 font-bold text-xl;
}
::v-deep .tab-card-slot {
    max-height: 300px;
    height: 100%;
    overflow-y: auto;
}
.no-data-block {
    height: 300px;
    @apply flex items-center justify-center;
}
</style>
