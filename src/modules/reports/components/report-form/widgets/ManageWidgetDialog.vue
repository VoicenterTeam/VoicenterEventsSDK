<template>
    <div>
        <div class="cursor-pointer text-primary-300 hover:text-primary"
             @click="openDialog">
            <div class="flex items-center">
                <i class="w-4 h-4 mx-2">
                    <IconAddReport/>
                </i>
                <span class="text-main-sm leading-4">
                    {{ $t('report.manageReportItems') }}
                </span>
            </div>
        </div>
        <modal :visible.sync="showDialog"
               title="report.manageReportItems"
               width="50%"
               :title-centered="true"
               v-show="showDialog">
            <div class="min-h-40 dialog-wrapper"
                 v-if="showDialog"
                 v-loading="localLoading">
                <div class="flex w-full justify-center py-4-5">
                    <div class="w-1/2">
                        <el-input :placeholder="$t('general.search')"
                                  size="small"
                                  prefix-icon="el-icon-search"
                                  v-model="search"/>
                    </div>
                </div>
                <div v-for="(item, index) in filteredItems"
                     :key="`report-item-${item.WidgetID}`"
                >
                    <div class="flex items-center justify-between h-20">
                        <div class="flex items-center">
                            <el-checkbox :value="item.selected"
                                         :id="`item-${index}`"
                                         :key="`item-${index}`"
                                         @change="onTrigger($event, item)"
                            />
                            <component class="mx-3 text-primary"
                                       :is="getTemplateIcon(item)"/>
                            <span class="flex-1 truncate">
                                {{ item.Title }}
                            </span>
                        </div>
                        <div class="flex items-center text-primary">
                            <AlertCircleIcon class="w-5 h-5"/>
                            <span class="mx-2 text-sm">
                                    {{ $t('general.help') }}
                                </span>
                        </div>
                    </div>
                </div>
            </div>
            <template v-slot:footer>
                <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                    <slot name="footer-actions">
                        <cancel-button
                            class="mx-4"
                            @on-click="onCancel"
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
    import { Checkbox } from 'element-ui'
    import Modal from '@/components/Common/Modal'
    import { AlertCircleIcon } from 'vue-feather-icons'
    import { templateIcons } from '@/enum/widgetDataTypes'
    import WidgetGroup from '@/modules/reports/components/report-form/widgets/WidgetGroup'
    import CancelButton from "@/components/Common/Buttons/CancelButton"
    import ConfirmButton from "@/components/Common/Buttons/ConfirmButton"

    export default {
        components: {
            Modal,
            WidgetGroup,
            AlertCircleIcon,
            [Checkbox.name]: Checkbox,
            CancelButton,
            ConfirmButton
        },
        props: {
            report: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                showDialog: false,
                steps: {},
                search: '',
                reportItems: [],
                localLoading: true,
            }
        },
        computed: {
            widgets() {
                return this.$store.getters['dashboards/getAllWidgets']
            },
            filteredItems() {
                return this.reportItems.filter(widget => widget.Title.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()))
            },
        },
        methods: {
            getTemplateIcon(item) {
                return templateIcons[item.WidgetLayout.DataTypeID]
            },
            onTrigger(evt, widget) {
                widget.selected = evt
                this.$set(widget, 'selected', evt)
            },
            onSubmit() {
                const items = this.reportItems.filter(item => item.selected).map((el, index) => {
                    return {
                        WidgetID: el.WidgetID,
                        ReportItemName: el.Title,
                        ReportItemStatusID: 1,
                        ReportItemOrder: index,
                        ReportItemExport: [
                            {
                                ReportExportTypeID: 3,
                            },
                        ],
                    }
                })
                this.$emit('submit', items)
                this.showDialog = false
            },
            stopLoadingProgress() {
                this.$nextTick(() => {
                    this.localLoading = false
                })
            },
            formatItems(items) {
                this.localLoading = true
                if (!this.report.ReportID) {
                    this.reportItems = items
                    return this.stopLoadingProgress()
                }
                this.reportItems = items.map(el => {
                    this.findItem(el, (r) => {
                        if (r) {
                            el.selected = r['ReportItemStatusID'] === 1
                        }
                    })
                    return el
                })
                this.stopLoadingProgress()
            },
            findItem(item, callback) {
                const result = this.report.ReportItemList.find(el => el.WidgetID.toString() === item.WidgetID.toString()) || false
                return callback(result)
            },
            openDialog() {
                this.formatItems(this.widgets)
                this.showDialog = true
            },
            onCancel () {
                this.showDialog = false
            }
        },
    }
</script>
<style lang="scss">
.dialog-wrapper > .el-loading-mask > .el-loading-spinner {
    @apply fixed left-0;
}
</style>
