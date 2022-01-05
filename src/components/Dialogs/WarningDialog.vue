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
import Dialog from '@/components/Dialogs/Dialog'
import dialogMixin from '@/mixins/dialogMixin'

export default {
    mixins: [ dialogMixin ],
    components: {
        Dialog,
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
            titleDefault: this.$t('Warning'),
            descriptionDefault: 'Are you sure that you want to do this?'
        }
    },
}
</script>
