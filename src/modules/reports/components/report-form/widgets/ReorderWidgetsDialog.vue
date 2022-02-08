<template>
    <div class="">
        <div class="cursor-pointer text-primary-300 hover:text-primary mx-8"
             @click="showDialog = true">
            <div class="flex items-center">
                <IconChangeOrder class="w-5 h-5 mx-1"/>
                <span class="text-main-sm leading-4">
                    {{ $t('widget.changeWidgetOrder') }}
                </span>
            </div>
        </div>
        <modal :visible.sync="showDialog"
               title="widget.widgetReorder"
               top="15vh"
               wrapper-classes="reorder-widgets"
               :title-centered="true"
               @close="onCloseModal"
               v-show="showDialog">
            <div class="py-6 px-5">
                <tabs :options="sections"
                      class="mx-0-25"
                      @on-change="onChangeSection"
                      :current="activeSection"
                />
                <div class="border-2 rounded-md bg-white content-wrapper transition ease-in-out duration-50"
                     :class="$rtl.isRTL  ? 'rounded-tr-none' : 'rounded-tl-none'">
                    <DraggableList :value="filteredItems"
                                   v-if="showDragList"
                                   @change="(ev) => onListChange(ev)"
                                   group="widgets">
                        <div :key="`${activeSection}-${item.WidgetID}-${index}`"
                             class="flex w-full items-center py-4 border-b border-gray-300 px-6 mx-2 cursor-move"
                             v-for="(item, index) in filteredItems">
                            <div class="flex items-center justify-between w-full item-wrapper">
                                <div class="flex items-center">
                                    <IconTemplateDefault class=""/>
                                    <div class="flex flex-col mx-4">
                                        <p class="truncate leading-6 text-xl font-normal">
                                            {{ $t(item.ReportItemName) }}
                                        </p>
                                        <p class="truncate leading-5 font-normal leading-5 text-sm text-steel">
                                            {{ $t(item.ReportItemDescription) }}
                                        </p>
                                    </div>
                                </div>
                                <i>
                                    <IconDragAndDrop class="text-gray-500 hover:text-primary"/>
                                </i>
                            </div>
                        </div>
                    </DraggableList>
                </div>
            </div>
            <template v-slot:footer>
                <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                    <slot name="footer-actions">
                        <cancel-button
                            class="mx-4"
                            @on-click="onCloseModal"
                        />
                        <confirm-button
                            :label="this.$t('Save')"
                            icon="IconSave"
                            @on-click="onSubmit"
                        />
                    </slot>
                </div>
            </template>
        </modal>
    </div>
</template>
<script>
    import Modal from '@/components/Common/Modal'
    import Tabs from '@/modules/common/components/Tabs'
    import DraggableList from '@/components/Widgets/DraggableList'
    import { BOTH_EXPORT_TYPE_ID } from '@/modules/reports/enum/report'
    import cloneDeep from 'lodash/cloneDeep'
    import CancelButton from "@/components/Common/Buttons/CancelButton"
    import ConfirmButton from "@/components/Common/Buttons/ConfirmButton"

    export default {
        components: {
            Tabs,
            Modal,
            DraggableList,
            CancelButton,
            ConfirmButton,
        },
        props: {
            report: {
                type: Object,
                default: () => ({
                    ReportItemList: [],
                }),
            },
        },
        data() {
            return {
                sections: [
                    {
                        label: this.$t('general.PDF'),
                        icon: 'IconPdf',
                        key: 2,
                    },
                    {
                        label: this.$t('widget.spreadsheet'),
                        icon: 'IconSpreadsheet',
                        key: 1,
                    },
                ],
                activeSection: 2,
                showDialog: false,
                showDragList: true,
                reportItems: [],
            }
        },
        computed: {
            filteredItems() {
                return this.reportItems.filter(item => [this.activeSection, BOTH_EXPORT_TYPE_ID].includes(item.ReportItemExport[0]['ReportExportTypeID']))
            },
        },
        methods: {
            onCloseModal() {
                this.resetProgress()
                this.showDialog = false
            },
            resetProgress() {
                this.fetchReportItems()
            },
            onSubmit() {
                this.$emit('submit', this.reportItems)
                this.showDialog = false
            },
            onListChange(evt = { moved: {} }) {
                const { newIndex, oldIndex } = evt['moved']
                this.reportItems.splice(newIndex, 0, this.reportItems.splice(oldIndex, 1)[0])
                this.updateOrderField()
            },
            updateOrderField() {
                this.reportItems.forEach((el, index) => {
                    this.$set(el, 'ReportItemExport[0].ReportExportOrder', index)
                })
            },
            onChangeSection(section) {
                this.showDragList = false
                this.activeSection = section
                setTimeout(() => {
                    this.showDragList = true
                }, 200)
            },
            fetchReportItems() {
                this.reportItems = cloneDeep(this.report.ReportItemList) || []
            },
        },
        mounted() {
            this.fetchReportItems()
        },
    }
</script>
<style lang="scss">
.el-dialog__wrapper.reorder-widgets .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 60vh;
    overflow: auto;
}

.reorder-widgets {
    .content-wrapper {
        max-height: 50vh;
        min-height: 50vh;
        @apply overflow-y-auto overflow-x-hidden;
    }

    .item-wrapper:hover {
        @apply text-primary;
        i > svg {
            path, circle {
                stroke: var(--primary-color);
            }
        }
    }
}
</style>
