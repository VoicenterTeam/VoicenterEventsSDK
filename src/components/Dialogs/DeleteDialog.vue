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
            titleDefault: this.$t('Delete Confirmation'),
            descriptionDefault: this.$t('dialog.delete.description'),
            configDefault: {
                confirmIcon: 'IconDelete',
                confirmText: this.$t('Delete'),
                ...this.config
            }
        }
    },
}
</script>
