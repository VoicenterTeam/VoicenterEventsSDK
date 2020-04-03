<template>
    <div class="w-auto bg-white px-6 flex items-center justify-between rounded-lg shadow widget-card p-4"
         :class="{'is-vertical': isVertical}"
         :style="getStyles">
        <div class="w-full flex items-center justify-center"
             :class="{'flex-col': isVertical}">
            <slot name="icon">
                <component class="min-w-16 status-icon mx-1 text-primary" :is="cardIcon"/>
            </slot>
            <slot name="text">
                <el-tooltip v-if="showText" class="item" effect="dark" :content="statusText" placement="top">
                    <h5 class="text-main-xl font-bold mx-3 status-text" :style="textColor">
                        {{statusText}}
                    </h5>
                </el-tooltip>
            </slot>
            <div :class="{[$rtl.isRTL ? 'mr-auto' : 'ml-auto']: !isVertical}">
                <slot name="value">
                    <h5 class="text-6xl font-bold -my-5"
                        :class="{'-my-6': isVertical}"
                        v-if="cardValue" :style="textColor">
                        {{cardValue}}
                    </h5>
                </slot>
            </div>
            <div class="absolute flex action-icons" :class="{'edit-mode': editable}">
                <template v-if="editable">
                    <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                        <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon"
                                    @click="$emit('remove-item')"/>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                        <edit-icon class="flex align-center w-10 h-8 p-2 edit-icon text-primary"
                                   :style="{ color: textColor.color }"
                                   @click="showModal = true"/>
                    </el-tooltip>
                    <div class="flex">
                        <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"/>
                        <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"/>
                    </div>
                </template>
                <template v-else>
                    <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                        <edit-icon class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"
                                   :style="{ color: textColor.color }"
                                   @click="showModal = true"/>
                    </el-tooltip>
                </template>
            </div>
        </div>
        <update-dialog
            v-if="showModal"
            :visible.sync="showModal"
            :model="model"
            @on-change="onChange">
            <template v-slot:header>
                <component class="w-8 mx-1" :is="selectedIcon"/>
                <p slot="title" class="text-main-lg font-semibold text-gray-700">{{$t(selectedOption.text)}}</p>
            </template>
            <template v-slot:content>
                <el-select :placeholder="$t('common.selectStatus')"
                           label="select"
                           v-model="selectedStatus"
                           @change="onStatusChange"
                           class="w-full">
                    <el-option v-for="option in statuses"
                               v-bind="option"
                               :key="option.value"
                               :label="$t(option.text)">
                        <div class="flex">
                            <component class="w-5 mx-1 text-primary" :is="option.icon"/>
                            <span class="w-16 mx-1">{{$t(option.text)}}</span>
                        </div>
                    </el-option>
                </el-select>
                <el-checkbox v-model="showStatusText" class="pt-4">
                    {{$t('status.show.text')}}
                </el-checkbox>
                <el-checkbox v-model="displayItemBorder" class="pt-4">
                    {{$t('status.display.border')}}
                </el-checkbox>
            </template>
            <template v-slot:width>
                <label class="pt-3 pb-2">{{$t('Widget max width')}}</label>
                <el-input type="number" v-model="layoutWidth.maxWidth"/>
                <label class="pt-3 pb-2">{{$t('Widget min width')}}</label>
                <el-input type="number" v-model="layoutWidth.minWidth"/>
            </template>
            <template v-slot:footer>
                <el-button @click="showModal = false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
            </template>
        </update-dialog>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Checkbox, Option, Select, Tooltip} from 'element-ui'
    import UpdateDialog from './UpdateDialog'
    import statusTypes from '@/enum/statusTypes'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import {EditIcon, MoreVerticalIcon, TrashIcon} from 'vue-feather-icons'
    const callStatuses = {
        CALLING: 100,
        HOLD: 101,
    }
    export default {
        props: {
            status: {
                type: Number,
                default: 3
            },
            editable: {
                type: Boolean,
                default: true
            },
            showText: {
                type: Boolean,
                default: true
            },
            displayBorder: {
                type: Boolean,
                default: true
            },
            data: {
                type: Object,
                default: () => ({})
            },
        },
        components: {
            TrashIcon,
            EditIcon,
            UpdateDialog,
            MoreVerticalIcon,
            [Option.name]: Option,
            [Select.name]: Select,
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
        },
        data() {
            return {
                showModal: false,
                isVertical: false,
                selectedStatus: '',
                selectedIcon: '',
                selectedOption: {},
                showStatusText: this.showText,
                displayItemBorder: this.displayBorder,
                model: {},
                layoutWidth: '',
            }
        },
        computed: {
            pageWidth() {
                return this.$store.state.utils.page.width
            },
            statuses() {
                const storeStatuses = this.$store.getters['entities/accountStatuses']
                let localStatuses = Object.values(statusTypes)
                let finalStatuses = []
                if (storeStatuses.length) {
                   finalStatuses = this.getStoreStatuses()
                } else {
                    finalStatuses = localStatuses.map(status => {
                        const statusText = this.$store.getters['entities/getStatusTextById'](status.value)
                        return {
                            ...status,
                            text: statusText
                        }
                    })
                }
                finalStatuses.push(statusTypes[callStatuses.CALLING])
                finalStatuses.push(statusTypes[callStatuses.HOLD])
                return finalStatuses
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
            cardValue() {
                let value = this.extensions.filter(el => el.representativeStatus === this.status).length || '0'
                if (this.status === callStatuses.CALLING) {
                    value = this.countTotalCalls() - this.countCallsByStatus('Hold') || '0'
                }
                if (this.status === callStatuses.HOLD) {
                    value = this.countCallsByStatus('Hold') || '0'
                }
                return value
            },
            cardIcon() {
                return statusTypes[this.status].icon
            },
            statusText() {
                return this.$t(this.$store.getters['entities/getStatusTextById'](this.status))
            },
            textColor() {
                let color = statusTypes[this.status].color
                return {
                    color: `${color}`
                }
            },
            getStyles() {
                if (!this.displayBorder) return;
                let color = statusTypes[this.status].color
                return {
                    border: `2px solid ${color}`,
                }
            },
            isMobileOrTablet() {
                return this.$store.getters['utils/isMobileOrTablet']
            },
        },
        methods: {
            countCallsByStatus(status) {
                if (!this.extensions.length) {
                    return '0'
                }
                const callsByStatus = this.extensions.filter(el => {
                    return el.calls.filter(c => c.callstatus === status).length > 0
                })
                return callsByStatus.length || '0'
            },
            countTotalCalls() {
                if (!this.extensions.length) {
                    return '0'
                }
                const callsByStatus = this.extensions.filter(el => el.calls.length > 0)
                return callsByStatus.length || '0'
            },
            getStoreStatuses() {
                const storeStatuses = this.$store.getters['entities/accountStatuses']
                let localStatuses = Object.values(statusTypes)
                return storeStatuses.map(status => {
                    const otherData = localStatuses.find(s => s.value === status.StatusID) || {}
                    if (otherData) {
                        otherData['text'] = this.$store.getters['entities/getStatusTextById'](otherData.value)
                    }
                    return {
                        ...status,
                        ...otherData,
                    }
                })
            },
            onChange() {
                let data = {
                    status: this.selectedStatus,
                    showText: this.showStatusText,
                    displayBorder: this.displayItemBorder,
                }

                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...data,
                    ...this.model,
                    ...this.layoutWidth
                };

                this.$emit('on-update', this.data);
                this.showModal = false;
            },
            onStatusChange(value) {
                let option = statusTypes[value];
                this.selectedOption = option;
                this.selectedStatus = option.value;
                this.selectedIcon = option.icon;
            },
            checkIfCardIsVertical() {
                if (this.layoutWidth.minWidth < 280) {
                    this.isVertical = true
                } else {
                    this.isVertical = false
                }
            }
        },
        mounted() {
            this.selectedStatus = this.status;
            this.selectedOption = statusTypes[this.status];
            this.selectedIcon = this.selectedOption.icon;
            this.layoutWidth = {
                maxWidth: this.data.WidgetLayout['maxWidth'] || '400',
                minWidth: this.data.WidgetLayout['minWidth'] || '250'
            }
            setTimeout(() => {
                this.checkIfCardIsVertical()
            }, 50)
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultColors)
                }
            },
            pageWidth: {
                immediate: true,
                handler() {
                    this.checkIfCardIsVertical()
                }
            },
            'layoutWidth.minWidth'() {
                this.$nextTick(this.checkIfCardIsVertical)
            }
        }
    }
</script>
<style scoped lang="scss">
    .status-icon {
        max-width: 64px;
    }

    .action-icons {
        top: 40px;
        right: 20px;

        &.edit-mode {
            top: 0;
        }
    }
</style>
