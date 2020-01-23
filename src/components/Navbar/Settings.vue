<template>
    <el-dialog v-bind="$attrs" v-on="$listeners" :append-to-body="true">
        <h3 slot="title" class="text-main-xl font-medium text-gray-700">{{$t('settings.update.title')}}</h3>
        <el-form @submit.native.prevent="updateSettings" :rules="rules" ref="settings" :model="settings">
            <el-collapse v-model="activeCollapses">
                <el-collapse-item :title="$t('settings.layout')" name="layout">
                    <el-form-item prop="DashboardTitle">
                        {{$t('dashboards.new.form.title')}}
                        <el-input v-model="DashboardTitle"/>
                    </el-form-item>
                    <el-form-item prop="logo" class="">
                        {{$t('dashboards.new.form.logo')}}
                        <div class="image-upload upload-button flex">
                            <label for="file-input" class="cursor-pointer flex items-center">
                                <img class="px-2"
                                     src="https://cdn.shopify.com/s/files/1/2065/6315/t/46/assets/UploadIcon.svg"/>
                                {{$t('Upload Logo')}}
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                @change="onFileChange()"/>
                            <div class="flex items-center" v-if="settings.logoName">
                                <p class="text-black px-2">{{settings.logoName}} </p>
                                <trash-icon class="cursor-pointer w-5 h-5 text-red trash-icon"
                                            @click="removeFile()"/>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item prop="showWidgetAsTabs">
                        <el-checkbox v-model="settings.showWidgetAsTabs">
                            {{$t('settings.widget.tabbed.view')}}
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item class="pb-4">
                        <label>{{$t('font.size')}}</label>
                            <el-slider
                                :min="fontSize.min"
                                :max="fontSize.max"
                                :marks="bestOptions"
                                v-model="settings.fontSize"
                                show-input>
                            </el-slider>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item :title="$t('settings.reports')" name="report">
                    <el-form-item prop="report.interval">
                        {{$t('settings.switch.title')}}
                        <el-input-number class="mx-2 w-36" size="small" :min="0"
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
                                v-model="settings.colors[option]"
                                :predefine="predefinedColors"/>
                            <span class="p-2 text-main-sm">{{$t('settings.color.'+option)}}</span>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button
                :disabled="storingData"
                :loading="storingData"
                type="primary"
                @click="updateSettings">{{$t('common.save')}}
            </el-button>
        </template>
    </el-dialog>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Dialog, Checkbox, Collapse, CollapseItem, InputNumber, Slider, Tooltip} from 'element-ui'
    import ColorPicker from '../Common/ColorPicker'
    import convertHex from '@/helpers/convertHex'
    import parseCatch from '@/helpers/handleErrors'
    import {updateDashboard} from '@/services/dashboardService'
    import {settingsColors, predefinedColors} from '@/enum/layout'
    import {getBase64} from '@/helpers/util'
    import {TrashIcon} from 'vue-feather-icons'

    export default {
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
            [InputNumber.name]: InputNumber,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [Tooltip.name]: Tooltip,
            [Slider.name]: Slider,
            ColorPicker,
            TrashIcon,
        },
        data() {
            return {
                settings: cloneDeep(this.$store.state.dashboards.settings),
                activeCollapses: ['layout', 'report', 'color'],
                predefinedColors,
                storingData: false,
                settingsColors,
                DashboardTitle: this.activeDashboard.DashboardTitle,
                fontSize: {
                    min: 8,
                    max: 24
                },
                bestOptions: {
                    14: '14',
                    16: '16',
                    20: '20'
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
            storeSettings() {
                return this.$store.state.dashboards.settings
            },
            rules() {
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
            storeSettings(newVal) {
                this.settings = cloneDeep(newVal)
            }
        },
        methods: {
            updateSettings() {
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
                        }).catch((e) => {
                            parseCatch(e, true)
                        }).finally((e) => {
                            this.storingData = false
                        })
                    }
                });
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            },
            async onFileChange() {
                let file = event.target.files[0]
                this.settings.logo = await getBase64(file)
                this.settings.logoName = file.name
            },
            removeFile() {
                this.settings.logoName = ''
            }
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
        /*color: var(--primary-color);*/
    }
</style>
