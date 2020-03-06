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
                default: false
            },
            displayBorder: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: () => ({})
            },
            isStatisticCard: {
                type: Boolean,
                default: false
            }
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
                if (storeStatuses.length) {
                    return storeStatuses.map(status => {
                        const otherData = localStatuses.find(s => s.value === status.StatusID) || {}
                        return {
                            ...status,
                            ...otherData,
                        }
                    })
                }
                return localStatuses.map(status => {
                    const statusText = this.$store.getters['entities/getStatusTextById'](status.value)
                    return {
                        ...status,
                        text: statusText
                    }
                })
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
            cardValue() {
                return this.extensions.filter(el => el.representativeStatus === this.status).length || '0'
            },
            cardIcon() {
                return this.isStatisticCard ? null : statusTypes[this.status].icon
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
                if (this.$el && this.$el.clientWidth < 280) {
                    this.isVertical = true
                } else {
                    this.isVertical = false
                }
            }
        },
        mounted() {
            if (this.isStatisticCard) return;
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
                    if (this.isStatisticCard) return;
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultColors)
                }
            },
            pageWidth: {
                immediate: true,
                handler() {
                    this.checkIfCardIsVertical()
                }
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
