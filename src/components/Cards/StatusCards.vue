<template>
    <div class="w-full bg-white px-6 py-4 my-4 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex items-center">
            <slot name="icon">
                <component class="min-w-16 mx-1 text-primary" :is="cardIcon"></component>
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
                                @click="$emit('remove-item')"></trash-icon>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-icon class="flex align-center w-10 h-8 p-2 edit-icon text-primary"
                               @click="()=>{this.showModal = true}"></edit-icon>
                </el-tooltip>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"></more-vertical-icon>
                <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"></more-vertical-icon>
            </div>
            <div v-else class="flex">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-icon class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"
                               @click="()=>{this.showModal = true}"></edit-icon>
                </el-tooltip>
            </div>
        </div>
        <update-dialog
            :status="status"
            :showText="showText"
            :visible.sync="showModal"
            @on-change="onChange">
            <template v-slot:header>
                <component class="w-8 mx-1" :is="selectedIcon"></component>
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
                            <component class="w-5 mx-1 text-primary" :is="option.icon"></component>
                            <span class="w-16 mx-1">{{$t(option.text)}}</span>
                        </div>
                    </el-option>
                </el-select>
                <el-checkbox v-model="showStatusText" class="pt-4">
                    {{$t('status.show.text')}}
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
    import {Tooltip, Select, Option, Checkbox} from 'element-ui'
    import UpdateDialog from './UpdateDialog'
    import statusTypes from '@/enum/statusTypes'
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
            isMobileOrTablet() {
                return this.$store.getters['utils/isMobileOrTablet']
            },
        },
        methods: {
            onChange() {
                let objectToEmit = {
                    status: this.selectedStatus,
                    showText: this.showStatusText
                }

                this.$emit('on-update-layout', objectToEmit);
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
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/widgets/card";
</style>
