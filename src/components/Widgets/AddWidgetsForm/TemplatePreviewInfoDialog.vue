<template>
    <div>
        <modal :append-to-body="true"
               v-bind="$attrs"
               v-on="$listeners"
               @close="onCloseDialog"
               :width="modalWidth"
               id="templatePreviewInfoDialog">
            <fade-transition :duration="transitionDuration"
                             mode="out-in">
                <TemplatePreviewInfo :templateHelp="templateHelp" />
            </fade-transition>
        </modal>
    </div>
</template>

<script>
import Modal from '@/components/Common/Modal'
import ConfirmDialog from '@/components/Common/ConfirmDialog'
import TemplatePreviewInfo from "@/components/Widgets/AddWidgetsForm/TemplatePreviewInfo";
import get from "lodash/get";

export default {
    components: {
        TemplatePreviewInfo,
        Modal,
        ConfirmDialog
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
