<template>
    <div v-click-outside="onMenuClickOutside">
        <el-popover
            trigger="manual"
            v-model="showActionsMenu"
            :popper-options="
                { 
                    boundariesElement: 'body'
                }
            "
            :visible-arrow="false"
            :placement="$rtl.isRTL ? 'bottom-start' : 'bottom-end'"
        >
            <IconOptions
                class="w-4 h-4 dots-icon text-primary cursor-pointer"
                @click="triggerMenu" slot="reference"
            />
            <div
                class="menu-wrapper"
            >
                <div class="menu-action_item"
                     @click="onShowUpdateDialog()">
                    <IconPencil class="text-green w-4-5 h-4-5"/>
                    <span class="mx-1">{{ $t('tooltip.edit.widget') }}</span>
                </div>
                <template v-if="isChartWidget(widget)">
                    <div @click="printChart(widget.WidgetID)"
                         :key="`print-${widget.WidgetID}`"
                         class="menu-action_item border-t border-gray-300">
                        <PrinterIcon class="text-blue-600 w-4-5 h-4-5"/>
                        <span class="mx-1">{{ $t('chart.printChart') }}</span>
                    </div>
                    <div @click="downloadChartAs(widget.WidgetID)"
                         :key="`download-${widget.WidgetID}`"
                         class="w-full rounded text-gray-700 flex items-center px-2 py-3 border-t border-gray-300 w-full justify-between">
                        <el-tooltip :content="$t('widget.downloadChartInTheSelectedFormat')"
                                    class="item"
                                    effect="dark"
                                    placement="top">
                            <div class="flex items-center hover:text-primary w-24">
                                <DownloadIcon class="text-blue-600 w-4-5 h-4-5"/>
                                <span class="mx-1">{{ $t('general.to') }}</span>
                            </div>
                        </el-tooltip>
                        <el-select v-model="downloadChartFormat"
                                   value-key="value"
                                   class="w-24"
                                   label-key="label">
                            <el-option v-for="format of DOWNLOAD_OPTIONS"
                                       :value="format.value"
                                       :key="format.value"
                                       :label="format.label">
                                {{ $t(format.label) }}
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template v-if="editable">
                    <div @click="onDuplicateWidget()"
                         class="menu-action_item border-t border-gray-300">
                        <IconDuplicate class="text-blue-600 w-4-5 h-4-5"/>
                        <span class="mx-1">{{ $t('widget.duplicateWidget') }}</span>
                    </div>
                    <div class="menu-action_item border-t border-gray-300"
                         @click="onRemoveWidget()">
                        <IconDelete class="text-red w-4-5 h-4-5"/>
                        <span class="mx-1">{{ $t('tooltip.remove.widget') }}</span>
                    </div>
                </template>
                <template v-if="isHtmlEditor(widget)">
                    <div @click="onTryManageHTMLNote"
                         class="menu-action_item border-t border-gray-300">
                        <el-switch :value="tryManageNote" class="pointer-events-none"/>
                        <span class="mx-1">{{ $t('tooltip.set.edit.mode') }}</span>
                    </div>
                </template>
                <template v-if="isNoteListWidget(widget)">
                    <div @click="onTryManageNoteList"
                         class="menu-action_item border-t border-gray-300 truncate">
                        <el-switch :value="tryManageNote" class="pointer-events-none"/>
                        <span class="mx-1">{{ $t('widget.editor.displayHiddenNotes') }}</span>
                    </div>
                    <div @click="onAddNote"
                         class="menu-action_item border-t border-gray-300">
                        <IconPlus class="w-3 h-3"/>
                        <span class="mx-1">{{ $t('widget.action.addNewNote') }}</span>
                    </div>
                </template>
            </div>
        </el-popover>
    </div>
</template>
<script>
    import bus from '@/event-bus/EventBus'
    import { Switch, Tooltip, Select, Option, Popover } from 'element-ui'
    import { PrinterIcon, DownloadIcon } from 'vue-feather-icons'
    import { isHtmlEditor, isNoteListWidget, isChartWidget } from '@/helpers/widgetUtils'

    const DOWNLOAD_JPEG = 'image/jpeg'
    const DOWNLOAD_PDF = 'application/pdf'
    const DOWNLOAD_PNG = 'image/png'
    const DOWNLOAD_SVG = 'image/svg+xml'

    const DOWNLOAD_OPTIONS = [
        {
            label: 'PDF',
            value: DOWNLOAD_PDF,
        },
        {
            label: 'PNG',
            value: DOWNLOAD_PNG,
        },
        {
            label: 'JPEG',
            value: DOWNLOAD_JPEG,
        },
        {
            label: 'SVG',
            value: DOWNLOAD_SVG,
        },
    ]

    export default {
        components: {
            PrinterIcon,
            DownloadIcon,
            [Switch.name]: Switch,
            ElSelect: Select,
            ElOption: Option,
            [Tooltip.name]: Tooltip,
            [Popover.name]: Popover
        },
        props: {
            editable: {
                type: Boolean,
                default: false,
            },
            widget: {
                type: Object,
                default: () => ({}),
            },
            editMode: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                showActionsMenu: false,
                tryManageNote: false,
                downloadChartFormat: DOWNLOAD_PDF,
                DOWNLOAD_OPTIONS,
            }
        },
        methods: {
            isHtmlEditor,
            isChartWidget,
            isNoteListWidget,
            onDuplicateWidget() {
                this.emitter('on-duplicate')
            },
            onRemoveWidget() {
                this.emitter('on-remove')
            },
            onShowUpdateDialog() {
                this.emitter('on-show-update-dialog')
            },
            onTryManageNoteList() {
                this.emitter('on-manage-notes')
            },
            onTryManageHTMLNote() {
                this.showActionsMenu = false
                this.emitter('on-manage-notes')
            },
            triggerMenu() {
                if (this.tryManageNote && isHtmlEditor(this.widget)) { return }
                this.showActionsMenu = !this.showActionsMenu
            },
            onMenuClickOutside() {
                this.showActionsMenu = false
            },
            onAddNote() {
                this.emitter('on-add-note')
            },
            emitter(event) {
                this.onMenuClickOutside()
                this.$emit(event)
            },
            printChart(WidgetID) {
                bus.$emit('print-chart', WidgetID)
            },
            downloadChartAs(WidgetID) {
                bus.$emit('download-chart', {
                    type: this.downloadChartFormat,
                    WidgetID,
                })
            },
        },
        watch: {
            editMode(state) {
                this.tryManageNote = state
            },
        },
    }
</script>
<style lang="scss" scoped>
.menu-action_item {
    @apply w-full rounded text-gray-700 flex items-center p-2 cursor-pointer;
    &:hover {
        color: var(--primary-color);
    }
}
</style>
