<template>
    <Dialog
        v-bind="attrs"
        v-on="$listeners"
        :title="dialogTitle"
        :description="dialogDescription"
        :config="configDefault"
    >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
    </Dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'

export default {
    mixins: [ dialogMixin ],
    components: {
        Dialog: () => import('@/components/Dialogs/Dialog')
    },
    data () {
        return {
            titleDefault: this.$t('general.deleteConfirmation'),
            descriptionDefault: this.$t('dialog.delete.description'),
            configDefault: {
                confirmIcon: 'IconDelete',
                confirmText: this.$t('common.delete'),
                ...this.config
            }
        }
    },
}
</script>
