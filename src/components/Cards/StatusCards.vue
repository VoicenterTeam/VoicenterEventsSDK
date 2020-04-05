<template>
    <div :class="{'is-vertical': isVertical}"
         :style="getStyles"
         class="w-auto bg-white px-6 flex items-center justify-between rounded-lg shadow widget-card p-4">
        <div :class="{'flex-col': isVertical}"
             class="w-full flex items-center justify-center">
            <slot name="icon">
                <component :is="cardIcon" class="min-w-16 status-icon mx-1 text-primary"/>
            </slot>
            <slot name="text">
                <el-tooltip :content="statusText" class="item" effect="dark" placement="top" v-if="showText">
                    <h5 :style="textColor" class="text-main-xl font-bold mx-3 status-text">
                        {{statusText}}
                    </h5>
                </el-tooltip>
            </slot>
            <div :class="{[$rtl.isRTL ? 'mr-auto' : 'ml-auto']: !isVertical}">
                <slot name="value">
                    <h5 :class="{'-my-6': isVertical}"
                        :style="textColor"
                        class="text-6xl font-bold -my-5" v-if="cardValue">
                        {{cardValue}}
                    </h5>
                </slot>
            </div>
            <div :class="{'edit-mode': editable}" class="absolute flex action-icons">
                <template v-if="editable">
                    <el-tooltip :content="$t('tooltip.remove.widget')" class="item" effect="dark" placement="top">
                        <trash-icon @click="$emit('remove-item')"
                                    class="flex align-center w-8 h-8 p-2 text-red trash-icon"/>
                    </el-tooltip>
                    <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                        <edit-icon :style="{ color: textColor.color }"
                                   @click="showModal = true"
                                   class="flex align-center w-10 h-8 p-2 edit-icon text-primary"/>
                    </el-tooltip>
                    <div class="flex">
                        <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"/>
                        <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"/>
                    </div>
                </template>
                <template v-else>
                    <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                        <edit-icon :style="{ color: textColor.color }"
                                   @click="showModal = true"
                                   class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"/>
                    </el-tooltip>
                </template>
            </div>
        </div>
        <update-dialog
            :model="model"
            :visible.sync="showModal"
            @on-change="onChange"
            v-if="showModal">
            <template v-slot:header>
                <component :is="selectedIcon" class="w-8 mx-1"/>
                <p class="text-main-lg font-semibold text-gray-700" slot="title">{{$t(selectedOption.text)}}</p>
            </template>
            <template v-slot:content>
                <el-select :placeholder="$t('common.selectStatus')"
                           @change="onStatusChange"
                           class="w-full"
                           label="select"
                           v-model="selectedStatus">
                    <el-option :key="option.value"
                               :label="$t(option.text)"
                               v-bind="option"
                               v-for="option in statuses">
                        <div class="flex">
                            <component :is="option.icon" class="w-5 mx-1 text-primary"/>
                            <span class="w-16 mx-1">{{$t(option.text)}}</span>
                        </div>
                    </el-option>
                </el-select>
                <el-checkbox class="pt-4" v-model="showStatusText">
                    {{$t('status.show.text')}}
                </el-checkbox>
                <el-checkbox class="pt-4" v-model="displayItemBorder">
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
                <el-button @click="onChange" type="primary">{{$t('common.save')}}</el-button>
            </template>
        </update-dialog>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Checkbox, Option, Select, Tooltip} from 'element-ui'
    import UpdateDialog from './UpdateDialog'
    import statusTypes, {callStatuses} from '@/enum/statusTypes'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import {EditIcon, MoreVerticalIcon, TrashIcon} from 'vue-feather-icons'
    import extensionMixin from "@/mixins/extensionMixin";

    export default {
        mixins: [extensionMixin],
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
        data () {
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
            pageWidth () {
                return this.$store.state.utils.page.width
            },
            statuses () {
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
            cardValue () {
                return this.extensionWithCalls.filter(el => el.representativeStatus === this.status).length || '0'
            },
            cardIcon () {
                return statusTypes[this.status].icon
            },
            statusText () {
                return this.$t(this.$store.getters['entities/getStatusTextById'](this.status))
            },
            textColor () {
                let color = statusTypes[this.status].color
                return {
                    color: `${color}`
                }
            },
            getStyles () {
                if (!this.displayBorder) return;
                let color = statusTypes[this.status].color
                return {
                    border: `2px solid ${color}`,
                }
            },
            isMobileOrTablet () {
                return this.$store.getters['utils/isMobileOrTablet']
            },
        },
        methods: {
            getStoreStatuses () {
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
            onChange () {
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
            onStatusChange (value) {
                let option = statusTypes[value];
                this.selectedOption = option;
                this.selectedStatus = option.value;
                this.selectedIcon = option.icon;
            },
            checkIfCardIsVertical () {
                if (this.layoutWidth.minWidth < 280) {
                    this.isVertical = true
                } else {
                    this.isVertical = false
                }
            }
        },
        mounted () {
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
                handler () {
                    this.checkIfCardIsVertical()
                }
            },
            'layoutWidth.minWidth' () {
                this.$nextTick(this.checkIfCardIsVertical)
            }
        }
    }
</script>
<style lang="scss" scoped>
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
