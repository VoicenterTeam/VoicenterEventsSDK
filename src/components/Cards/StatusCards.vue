<template>
    <div class="w-full bg-white px-6 flex items-center justify-between rounded-lg shadow"
         :style="borderColor">
        <div class="w-full flex items-center">
            <slot name="icon">
                <component class="min-w-16 mx-1 text-primary" :is="cardIcon"/>
            </slot>
            <slot name="text">
                <el-tooltip v-if="showText" class="item" effect="dark" :content="statusText" placement="top">
                    <h5 class="text-xl font-bold mx-3 status-text" :style="textColor">
                        {{statusText}}
                    </h5>
                </el-tooltip>
            </slot>
            <div :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
                <slot name="value">
                    <h5 class="text-6xl font-bold -mr-3" v-if="cardValue" :style="textColor">
                        {{cardValue}}
                    </h5>
                </slot>
            </div>
            <div class="flex editable-content" v-if="editable">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                    <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon"
                                @click="$emit('remove-item')"/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-icon class="flex align-center w-10 h-8 p-2 edit-icon text-primary"
                               @click="()=>{this.showModal = true}"/>
                </el-tooltip>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"/>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"/>
            </div>
            <div v-else class="flex">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-icon class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"
                               @click="()=>{this.showModal = true}"/>
                </el-tooltip>
            </div>
        </div>
        <update-dialog
            v-if="showModal"
            :visible.sync="showModal"
            :model="model"
            @on-change="onChange">
            <template v-slot:header>
                <component class="w-8 mx-1" :is="selectedIcon"/>
                <p slot="title" class="text-lg font-semibold text-gray-700">{{$t(selectedOption.text)}}</p>
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
            <template v-slot:footer>
                <el-button @click="showModal = false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
            </template>
        </update-dialog>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Tooltip, Select, Option, Checkbox} from 'element-ui'
    import UpdateDialog from './UpdateDialog'
    import statusTypes from '@/enum/statusTypes'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import {TrashIcon, EditIcon, MoreVerticalIcon} from 'vue-feather-icons'

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
                selectedStatus: '',
                selectedIcon: '',
                selectedOption: {},
                showStatusText: this.showText,
                displayItemBorder: this.displayBorder,
                model: {},
            }
        },
        computed: {
            statuses() {
                return Object.values(statusTypes)
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
            cardValue() {
                return this.extensions.filter(el => el.representativeStatus === this.status).length || '0'
            },
            cardIcon() {
                return statusTypes[this.status].icon
            },
            statusText() {
                return this.$t(statusTypes[this.status].text)
            },
            textColor() {
                let color = statusTypes[this.status].color
                return {
                    color: `${color}`
                }
            },
            borderColor() {
                if (!this.displayBorder) return;
                let color = statusTypes[this.status].color
                return {
                    border: `2px solid ${color}`
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
                    ...this.model
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
        },
        mounted() {
            this.selectedStatus = this.status;
            this.selectedOption = statusTypes[this.status];
            this.selectedIcon = this.selectedOption.icon;
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultColors)
                }
            }
        }
    }
</script>
