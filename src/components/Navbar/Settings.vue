<template>
    <el-dialog v-bind="$attrs" v-on="$listeners" :append-to-body="true">
        <h3 slot="title" class="text-xl font-medium text-gray-700">{{$t('settings.update.title')}}</h3>
        <el-form @submit.native.prevent="updateSettings" :rules="rules" ref="settings" :model="settings">
            <el-collapse v-model="activeCollapses">
                <el-collapse-item :title="$t('settings.layout')" name="layout">
                    <div class="flex flex-col">
                        <div class="md:flex md:flex-col md:justify-center">
                            <el-checkbox v-model="settings.showGeneralWidgetSearch">
                                {{$t('settings.widget.search')}}
                            </el-checkbox>
                        </div>
                        <div class="md:flex md:flex-col md:justify-center mt-4">
                            <el-checkbox v-model="settings.showWidgetAsTabs">
                                {{$t('settings.widget.tabbed.view')}}
                            </el-checkbox>
                        </div>
                    </div>
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
                    <div class="flex">
                        <el-color-picker v-model="settings.colors.primary"/>
                        <span class="p-2">{{$t('settings.color.primary')}}</span>
                        <el-color-picker v-model="settings.colors.secondary"/>
                        <span class="p-2">{{$t('settings.color.secondary')}}</span>
                        <el-color-picker v-model="settings.colors.background"/>
                        <span class="p-2">{{$t('settings.color.background')}}</span>
                        <el-color-picker v-model="settings.colors.frames"/>
                        <span class="p-2">{{$t('settings.color.frames')}}</span>
                        <el-color-picker v-model="settings.colors.widgetGroupBackground"/>
                        <span class="p-2">{{$t('settings.color.widgetGroupBackground')}}</span>
                        <el-color-picker v-model="settings.colors.widgetGroupFrames"/>
                        <span class="p-2">{{$t('settings.color.widgetGroupFrames')}}</span>
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
    import {Dialog, Checkbox, Collapse, CollapseItem, ColorPicker, InputNumber} from 'element-ui'
    import convertHex from '@/helpers/convertHex'
    import parseCatch from '@/helpers/handleErrors'
    import {updateDashboard} from '@/services/dashboardService'

    export default {
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
            [InputNumber.name]: InputNumber,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [ColorPicker.name]: ColorPicker,
        },
        data() {
            return {
                settings: cloneDeep(this.$store.state.dashboards.settings),
                activeCollapses: ['layout', 'report', 'color'],
                storingData: false
            }
        },
        props: {
            activeDashboard: {
                type: Object,
                default: () => ({})
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
            }
        }
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
</style>
