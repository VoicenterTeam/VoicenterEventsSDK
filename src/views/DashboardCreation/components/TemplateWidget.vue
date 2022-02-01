<template>
    <div class="widget-wrapper shadow-base p-6 rounded-md">
        <div class="flex items-center">
            <i>
                <component :is="getTemplateIcon"
                           class="text-primary"
                />
            </i>
            <div class="flex flex-col mx-3 lg:mx-4">
                <p class="mb-1">
                    {{ $t(widget.DefaultWidgetTitle) }}
                </p>
                <div class="flex text-primary-300 hover:text-primary cursor-help"
                     @click="onLearnMore">
                    <i>
                        <IconInfo></IconInfo>
                    </i>
                    <span class="mx-1">
                        {{ $t('widget.learnMore') }}
                    </span>
                </div>
            </div>
        </div>
        <TemplateWidgetInfoDialog v-if="showInfoDialog"
                                  :visible.sync="showInfoDialog"
                                  @on-cancel="showInfoDialog = false"
                                  @on-submit="showInfoDialog = false"
                                  :widget="widget"
                                  :template-icon="getTemplateIcon"
                                  v-bind="$attrs"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { templateIcons } from '@/enum/widgetDataTypes'
    import TemplateWidgetInfoDialog from '@/views/DashboardCreation/components/TemplateWidgetInfoDialog'

    export default {
        components: {
            TemplateWidgetInfoDialog,
        },
        props: {
            widget: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                showInfoDialog: false,
            }
        },
        computed: {
            getTemplateIcon() {
                const dataTypeID = get(this.widget, 'WidgetLayout.DataTypeID', false)
                if (!dataTypeID) {
                    return 'IconTemplateDefault'
                }
                return templateIcons[dataTypeID]
            },
        },
        methods: {
            onLearnMore() {
                this.showInfoDialog = true
            },
        },
    }
</script>
