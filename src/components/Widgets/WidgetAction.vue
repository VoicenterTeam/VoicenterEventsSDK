<template>
    <div class="relative px-4 py-1-5 rounded hover:bg-primary-100 cursor-pointer"
         @click.stop="triggerMenu"
         :class="{'bg-primary-100': showActionsMenu}">
        <IconOptions class="w-1 h-5 text-gray-500 hover:text-primary"/>
        <fade-transition :duration="350">
            <div v-click-outside="onMenuClickOutside"
                 class="menu-wrapper px-3 py-1 absolute z-50 mt-2"
                 :class="$rtl.isRTL ? 'left-0' : 'right-0'"
                 v-if="showActionsMenu"
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
                        <el-tooltip :content="$t('Download chart in the selected format')"
                                    class="item"
                                    effect="dark"
                                    placement="top">
                            <div class="flex items-center hover:text-primary w-24">
                                <DownloadIcon class="text-blue-600 w-4-5 h-4-5"/>
                                <span class="mx-1">{{ $t('To') }}</span>
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
                        <span class="mx-1">{{ $t('Duplicate widget') }}</span>
                    </div>
                    <div class="menu-action_item border-t border-gray-300"
                         @click="onRemoveWidget()">
                        <IconDelete class="text-red w-4-5 h-4-5"/>
                        <span class="mx-1">{{ $t('tooltip.remove.widget') }}</span>
                    </div>
                </template>
                <template v-if="isHtmlEditor(widget)">
                    <div @click="onTryManageNote"
                         class="menu-action_item border-t border-gray-300">
                        <el-switch :value="tryManageNote"
                                   @change="onTryManageNote"/>
                        <span class="mx-1">{{ $t('tooltip.set.edit.mode') }}</span>
                    </div>
                </template>
                <template v-if="isNoteListWidget(widget)">
                    <div @click="onTryManageNote"
                         class="menu-action_item border-t border-gray-300 truncate">
                        <el-switch :value="tryManageNote"
                                   @change="onTryManageNote"/>
                        <span class="mx-1">{{ $t('Display hidden notes') }}</span>
                    </div>
                    <div @click="onAddNote"
                         class="menu-action_item border-t border-gray-300">
                        <IconPlus class="w-3 h-3"/>
                        <span class="mx-1">{{ $t('Add New Note') }}</span>
                    </div>
                </template>
            </div>
        </fade-transition>
    </div>
</template>
<script>
    import bus from '@/event-bus/EventBus'
    import { Switch, Tooltip, Select, Option } from 'element-ui'
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
            onTryManageNote() {
                this.emitter('on-manage-notes')
            },
            triggerMenu() {
                this.showActionsMenu = !this.showActionsMenu
            },
            onMenuClickOutside() {
                this.showActionsMenu = false
            },
            onAddNote() {
                this.emitter('on-add-note')
            },
            emitter(event) {
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
.menu-wrapper {
    @apply rounded z-50 bg-white w-56 flex flex-col origin-top-right max-h-screen overflow-auto;
    box-shadow: 0 0 5px var(--gray-350);
}

.menu-action_item {
    @apply w-full rounded text-gray-700 flex items-center px-2 py-3;
    &:hover {
        color: var(--primary-color);
    }
}
</style>
