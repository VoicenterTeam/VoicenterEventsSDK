<template>
    <div>
        <base-wrapper
            :cardIcon="null"
            :cardText="DATA_KEY"
            :cardValue="cardValue"
            :showText="showText"
            :styles="getCardStyles"
            @show-modal="onShowModal"
            v-bind="$attrs"
            v-on="$listeners"
        />
        <update-dialog
            :model="model"
            :visible.sync="showModal"
            @on-change="onChange"
            v-if="showModal">
            <template v-slot:content>
                <el-form @submit.native.prevent="onChange">
                    <el-form-item>
                        <el-checkbox v-model="showCardText">
                            {{$t('status.show.text')}}
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="displayItemBorder">
                            {{$t('status.display.border')}}
                        </el-checkbox>
                    </el-form-item>
                </el-form>
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
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import UpdateDialog from './UpdateDialog'
    import {getWidgetData} from '@/services/widgetService'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import {Checkbox, Tooltip} from 'element-ui'

    export default {
        components: {
            UpdateDialog,
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            showText: {
                type: Boolean,
                default: true
            },
            displayBorder: {
                type: Boolean,
                default: true
            },
        },
        computed: {
            getCardStyles () {
                let item = this.model

                let styles = {
                    color: {
                        'color': item.colors.fonts
                    },
                    'background': item.colors.background,
                    'min-width': `${this.layoutWidth.minWidth}px`,
                    'max-width': `${this.layoutWidth.maxWidth}px`,
                }

                if (this.displayBorder) {
                    styles = {
                        ...styles,
                        ...{
                            'border': `2px solid ${item.colors.frames}`,
                        }
                    }
                }
                return styles
            },
        },
        data () {
            return {
                fetchDataInterval: null,
                cardValue: null,
                DATA_KEY: 'Total Outgoing Calls',
                showModal: false,
                layoutWidth: {},
                showCardText: this.showText,
                displayItemBorder: this.displayBorder,
                model: {},
            }
        },
        methods: {
            get,
            async getWidgetData () {
                try {
                    let Data = await getWidgetData(this.data)
                    this.cardValue = get(Data, `[0][${this.DATA_KEY}]`)
                } catch (e) {
                    console.log(e)
                }
            },
            onShowModal () {
                this.showModal = true
            },
            onChange () {
                let data = {
                    showText: this.showStatusText,
                    displayBorder: this.displayItemBorder,
                }

                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...data,
                    ...this.model,
                    ...this.layoutWidth
                }

                this.$emit('on-update', this.data);
                this.showModal = false;
            },
        },
        mounted () {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }
            this.layoutWidth = {
                maxWidth: this.data.WidgetLayout['maxWidth'] || '400',
                minWidth: this.data.WidgetLayout['minWidth'] || '250'
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.getWidgetData()
                    this.model = cloneDeep(widget)
                    this.model.colors = cloneDeep(widget.WidgetLayout.colors || defaultColors)
                }
            }
        },
        beforeDestroy () {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
