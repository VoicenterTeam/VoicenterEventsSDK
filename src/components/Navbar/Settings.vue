<template>
    <modal :append-to-body="true" v-bind="$attrs" v-on="$listeners">
        <h3 class="text-main-xl font-medium text-gray-700" slot="title">{{$t('settings.update.title')}}</h3>
        <el-form :model="settings" :rules="rules" @submit.native.prevent="updateSettings" ref="settings">
            <el-collapse v-model="activeCollapses">
                <el-collapse-item :title="$t('settings.layout')" name="layout">
                    <el-form-item prop="DashboardTitle">
                        {{$t('dashboards.new.form.title')}}
                        <el-input v-model="DashboardTitle"/>
                    </el-form-item>
                    <el-form-item class="" prop="logo">
                        {{$t('dashboards.new.form.logo')}}
                        <div class="image-upload upload-button flex">
                            <label class="cursor-pointer flex items-center text-primary" for="file-input">
                                <IconUpload class="text-primary mr-2" :class="{'mr-0 ml-2': $rtl.isRTL}"/> {{$t('Upload Logo')}}
                            </label>
                            <input
                                @change="onFileChange()"
                                accept="image/*"
                                id="file-input"
                                type="file"/>
                            <div class="flex items-center" v-if="settings.logoName">
                                <p class="text-black px-2">{{settings.logoName}} </p>
                                <trash-icon @click="removeFile()"
                                            class="cursor-pointer w-5 h-5 text-red trash-icon"/>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item prop="showWidgetTitles">
                        <el-checkbox v-model="settings.showWidgetTitles">
                            {{$t('settings.widget.show.titles')}}
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item class="pb-4">
                        <label>{{$t('font.size')}}</label>
                        <el-slider
                            :marks="bestOptions"
                            :max="fontSize.max"
                            :min="fontSize.min"
                            show-input
                            v-model="settings.fontSize">
                        </el-slider>
                    </el-form-item>
                    <el-form-item class="pb-4">
                        <label>{{$t('widgetGroupTitles.font.size')}}</label>
                        <el-slider
                            :marks="titleBestOptions"
                            :max="titleFontSizes.max"
                            :min="titleFontSizes.min"
                            show-input
                            v-model="settings.widgetGroupTitlesFontSize">
                        </el-slider>
                    </el-form-item>
                    <el-form-item class="pb-4">
                        <label>{{$t('widgetTitles.font.size')}}</label>
                        <el-slider
                            :marks="titleBestOptions"
                            :max="titleFontSizes.max"
                            :min="titleFontSizes.min"
                            show-input
                            v-model="settings.widgetTitlesFontSize">
                        </el-slider>
                    </el-form-item>
                    <el-form-item class="pb-4">
                        <label>{{$t('settings.minRefreshInterval')}}</label>
                        <el-slider
                            :marks="refreshInterval.bestOptions"
                            :max="refreshInterval.max"
                            :min="refreshInterval.min"
                            :step="refreshInterval.step"
                            show-input
                            v-model="settings.minRefreshInterval">
                        </el-slider>
                    </el-form-item>
                    <el-form-item class="pb-4">
                        <label>{{$t('settings.refreshRealTimeDataDelay')}}</label>
                        <el-slider
                            :marks="refreshRealTimeDataDelay.bestOptions"
                            :max="refreshRealTimeDataDelay.max"
                            :min="refreshRealTimeDataDelay.min"
                            show-input
                            v-model="settings.refreshRealTimeDataDelay">
                        </el-slider>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item :title="$t('settings.reports')" name="report">
                    <el-form-item prop="report.interval">
                        {{$t('settings.switch.title')}}
                        <el-input-number :min="0" class="mx-2 w-36" size="small"
                                         v-model.number="settings.report.interval"/>
                        {{$t('settings.switch.interval')}}
                    </el-form-item>
                    <el-form-item prop="report.switching">
                        <el-checkbox v-model="settings.report.switching">
                            {{$t('settings.category.switching')}}
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item prop="report.refresh">
                        <el-checkbox v-model="settings.report.refresh">{{$t('settings.category.refresh')}}</el-checkbox>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item :title="$t('settings.colors')" name="color">
                    <div class="flex flex-col">
                        <div class="flex flex-row" v-for="option of settingsColors">
                            <color-picker
                                :predefine="predefinedColors"
                                v-model="settings.colors[option]"/>
                            <span class="p-2 text-main-sm">{{$t('settings.color.'+option)}}</span>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item :title="$t('Real time server')" name="socket">
                    <div class="flex items-center">
                        {{$t('Retry Socket Connection')}}
                        <socket-status-button @click="retrySocketConnection" class="mx-2"/>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button
                :disabled="storingData"
                :loading="storingData"
                @click="updateSettings"
                type="primary">{{$t('common.save')}}
            </el-button>
        </template>
    </modal>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import SocketStatusButton from '@/components/Common/SocketStatusButton'
    import {Checkbox, Collapse, CollapseItem, InputNumber, Slider, Tooltip} from 'element-ui'
    import Modal from "@/components/Common/Modal";
    import ColorPicker from '../Common/ColorPicker'
    import {convertHex} from '@/helpers/convertHex'
    import parseCatch from '@/helpers/handleErrors'
    import {updateDashboard} from '@/services/dashboardService'
    import {predefinedColors, settingsColors} from '@/enum/layout'
    import {settings as defaultSettings} from '@/enum/defaultDashboardSettings'
    import {getBase64} from '@/helpers/util'
    import {TrashIcon} from 'vue-feather-icons'
    import {retrySocketConnection} from "@/plugins/initRealTimeSdk";

    export default {
        inheritAttrs: false,
        components: {
            Modal,
            [InputNumber.name]: InputNumber,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [Tooltip.name]: Tooltip,
            [Slider.name]: Slider,
            SocketStatusButton,
            ColorPicker,
            TrashIcon,
        },
        data () {
            return {
                settings: cloneDeep(this.$store.state.dashboards.settings),
                activeCollapses: ['layout', 'report', 'color', 'socket'],
                predefinedColors,
                storingData: false,
                settingsColors,
                DashboardTitle: this.activeDashboard.DashboardTitle,
                fontSize: {
                    min: 8,
                    max: 24
                },
                titleFontSizes: {
                    min: 12,
                    max: 48
                },
                titleBestOptions: {
                    16: '16px',
                    22: '22px',
                    26: '26px',
                    32: '32px',
                },
                bestOptions: {
                    14: '14px',
                    16: '16px',
                    20: '20px'
                },
                refreshInterval: {
                    min: 10,
                    max: 1000,
                    step: 10,
                    bestOptions: {
                        100: '100s',
                        200: '200s',
                        400: '400s',
                        600: '600s',
                        800: '800s',
                    }
                },
                refreshRealTimeDataDelay: {
                    min: 3,
                    max: 90,
                    bestOptions: {
                        5: '5min',
                        15: '15min',
                        30: '30min',
                        45: '45min',
                        60: '60min',
                    }
                }
            }
        },
        props: {
            activeDashboard: {
                type: Object,
                default: () => ({}),
            }
        },
        computed: {
            storeSettings () {
                return this.$store.state.dashboards.settings
            },
            rules () {
                return {
                    'report.interval': [
                        {
                            min: this.settings.report.switching ? 5 : 0,
                            type: 'number',
                            message: this.$t('validation.interval'),
                        }
                    ],
                    DashboardTitle: {
                        min: 5,
                        max: 10,
                        message: this.$t('validation.interval'),
                    }
                }
            }
        },
        watch: {
            storeSettings (newVal) {
                this.settings = cloneDeep(newVal)
                this.addDefaultValues()
            }
        },
        mounted () {
            this.addDefaultValues()
        },
        methods: {
            /**
             * Ensure newly added colors are backwards compatible with old ones
             */
            addDefaultValues () {
                if (!this.settings.colors) {
                    this.settings.colors = {
                        ...defaultSettings.colors
                    }
                }
                for (let key in defaultSettings.colors) {
                    if (!this.settings.colors[key]) {
                        this.$set(this.settings.colors, key, defaultSettings.colors[key])
                    }
                }
                if (!this.settings.widgetTitlesFontSize) {
                    this.$set(this.settings, 'widgetTitlesFontSize', defaultSettings.widgetTitlesFontSize)
                }
                if (!this.settings.widgetGroupTitlesFontSize) {
                    this.$set(this.settings, 'widgetGroupTitlesFontSize', defaultSettings.widgetGroupTitlesFontSize)
                }
                if (this.settings.showWidgetTitles === undefined) {
                    this.$set(this.settings, 'showWidgetTitles', defaultSettings.showWidgetTitles)
                }
            },
            updateSettings () {
                this.$refs.settings.validate((valid) => {
                    if (valid) {
                        this.storingData = true
                        this.settings.colors.primary_rgba = convertHex(this.settings.colors.primary)
                        let dashboard = {
                            ...this.activeDashboard,
                            ...{DashboardTitle: this.DashboardTitle},
                            DashboardLayout: {...this.activeDashboard.DashboardLayout, ...{settings: this.settings}}
                        }
                        updateDashboard(dashboard).then((dashboard) => {
                            this.$store.dispatch('dashboards/updateDashboard', dashboard)
                            this.toggleVisibility(false)
                            localStorage.setItem('colors', JSON.stringify(this.settings.colors))
                        }).catch((e) => {
                            parseCatch(e, true)
                        }).finally((e) => {
                            this.storingData = false
                        })
                    }
                });
            },
            toggleVisibility (value) {
                this.$emit('update:visible', value)
            },
            async onFileChange () {
                let file = event.target.files[0]
                this.settings.logo = await getBase64(file)
                this.settings.logoName = file.name
            },
            removeFile () {
                this.settings.logoName = ''
            },
            retrySocketConnection,
        },
    }
</script>
<style lang="scss">
    .rtl .el-checkbox__inner {
        margin-left: 10px;
    }

    .rtl .el-color-svpanel {
        float: right;
    }

    .el-form-item {
        margin-bottom: 0;

        &.is-error {
            margin-bottom: 15px;
        }
    }

    .image-upload > input {
        display: none;
    }

    .upload-button {
        color: #678ee3;
    }
</style>
