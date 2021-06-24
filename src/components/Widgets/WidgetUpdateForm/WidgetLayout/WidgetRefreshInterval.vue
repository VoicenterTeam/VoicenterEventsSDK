<template>
    <div class="flex flex-row py-2">
        <div class="flex items-center">
            <span>{{ $t('Widget refresh interval') }}</span>
            <el-popover placement="bottom-start"
                        :content="$t('Set the interval when widget data will be reloaded automatically (in seconds)')"
                        class="mx-2"
                        trigger="hover">
                <InfoIcon class="text-primary cursor-help w-5" slot="reference"/>
            </el-popover>
        </div>
        <el-input-number v-model="model.WidgetLayout.DefaultRefreshInterval"
                         :min="minValue"
                         :max="maxValue"
                         :step="1"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { InfoIcon } from 'vue-feather-icons'
    import { InputNumber, Popover } from 'element-ui'
   
    export default {
        components: {
            InfoIcon,
            [Popover.name]: Popover,
            [InputNumber.name]: InputNumber,
        },
        props: {
            model: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {
            templateSettings() {
                return get(this.model, 'WidgetLayout.TemplateSettings', {
                    MinimumRefreshInterval: 30,
                    MaximumRefreshInterval: 1800,
                })
            },
            minValue() {
                return this.templateSettings.MinimumRefreshInterval
            },
            maxValue() {
                return Number(this.templateSettings.MaximumRefreshInterval) + 1
            },
        },
        methods: {
            checkForTemplateSettings() {
                const { TemplateSettings } = this.model.WidgetLayout
                this.fillTemplateSettings()
                if (!TemplateSettings) {
                    this.fillTemplateSettings()
                }
            },
            fillTemplateSettings() {
                const { TemplateID } = this.model
                const template = this.$store.getters['widgetTemplate/getWidgetTemplate'](TemplateID)
                if (!template) {
                    return
                }
                const { TemplateSettings } = template
                this.model.WidgetLayout = {
                    ...this.model.WidgetLayout,
                    TemplateSettings,
                }
            },
        },
        mounted() {
            this.checkForTemplateSettings()
        },
    }
</script>
