<template>
    <div>
        <base-wrapper
            :cardIcon="cardIcon"
            :cardText="cardText"
            :cardValue="cardValue"
            :layoutWidth="layoutWidth"
            :showText="showStatusText"
            :styles="getStyles"
            @show-modal="onShowModal"
            v-bind="$attrs"
            v-on="$listeners"
        />
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
    import UpdateDialog from './UpdateDialog'
    import extensionMixin from '@/mixins/extensionMixin'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import statusTypes, {callStatuses} from '@/enum/statusTypes'
    import {Checkbox, Option, Select, Tooltip} from 'element-ui'

    export default {
        mixins: [extensionMixin],
        props: {
            status: {
                type: Number,
                default: 3
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
            UpdateDialog,
            [Option.name]: Option,
            [Select.name]: Select,
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
        },
        data () {
            return {
                showModal: false,
                selectedStatus: '',
                selectedIcon: '',
                selectedOption: {},
                showStatusText: this.showText,
                displayItemBorder: this.displayBorder,
                model: {},
                layoutWidth: {},
            }
        },
        computed: {
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
            cardText () {
                return this.$t(this.$store.getters['entities/getStatusTextById'](this.status))
            },
            textColor () {
                let color = statusTypes[this.status].color
                return {
                    color: `${color}`
                }
            },
            getStyles () {
                let styles = {}
                let color = statusTypes[this.status].color

                styles = {
                    color: {
                        'color': color,
                    }
                };

                if (this.displayBorder) {
                    let border = {'border': `2px solid ${color}`}
                    styles = {
                        ...styles,
                        ...border,
                    }
                }
                return styles;
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
            onShowModal () {
                this.showModal = true
            },
        },
        mounted () {
            this.selectedStatus = this.status;
            this.selectedOption = statusTypes[this.status];
            this.selectedIcon = this.selectedOption.icon;
            this.layoutWidth = {
                maxWidth: this.data.WidgetLayout['maxWidth'] || '400',
                minWidth: this.data.WidgetLayout['minWidth'] || '250'
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultColors)
                }
            },

        }
    }
</script>
