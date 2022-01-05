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
import Dialog from '@/components/Dialogs/Dialog'
import dialogMixin from '@/mixins/dialogMixin'

export default {
    mixins: [ dialogMixin ],
    components: {
        Dialog,
    },
    data () {
        return {
            titleDefault: this.$t('Delete Confirmation'),
            descriptionDefault: 'Are you sure that you want to delete this Dashboard?',
            configDefault: {
                confirmIcon: 'IconDelete',
                confirmText: this.$t('Delete')
            }
        }
    },
}
</script>
