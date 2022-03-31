<template>
    <Dialog
        v-bind="attrs"
        v-on="$listeners"
        :title="dialogTitle"
        :description="dialogDescription"
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
    computed: {
        attrs () {
            return {
                ...this.$attrs,
                modalWidth: this.modalWidth
            }
        }
    },
    data () {
        return {
            titleDefault: this.$t('general.notification.warning'),
            descriptionDefault: this.$t('dialog.warning.description')
        }
    },
}
</script>
