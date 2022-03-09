<template>
        <modal :append-to-body="true"
               v-bind="$attrs"
               v-on="$listeners"
               @close="onCloseDialog"
               :width="modalWidth"
               id="templatePreviewInfoDialog">
            <template v-slot:title>
                {{ $t(widgetTitle) }}
            </template>
            <template-preview-info :templateHelp="templateHelp" />
        </modal>
</template>

<script>
import get from "lodash/get";

export default {
    name: "template-preview-info-dialog",
    inheritAttrs: false,
    components: {
        TemplatePreviewInfo: () => import("@/components/Widgets/AddWidgetsForm/TemplatePreviewInfo"),
        Modal: () => import('@/components/Common/Modal'),
        ConfirmDialog: () => import('@/components/Common/ConfirmDialog')
    },
    props: {
        modalWidth: {
            type: String,
            default: '50%',
        },
        transitionDuration: {
            default: 100
        },
        templateId: {
            type: Number
        },
        widgetTitle: {
            type: String
        }
    },
    data() {
      return {
          templateHelp: {}
      }
    },
    methods: {
        onCloseDialog() {
            this.$emit('on-close')
        },
        getHelpByWidgetsTemplateID() {
            const helpData = this.$store.getters['templatesCategory/getHelpByWidgetsTemplateID'](this.templateId)
            this.templateHelp = get(helpData, 'Help', {})
        },
    },
    mounted() {
        this.getHelpByWidgetsTemplateID()
    }
}
</script>
