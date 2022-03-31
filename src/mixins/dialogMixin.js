export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: '',
        },
        modalWidth: {
            type: String,
            default: '445px',
        },
        config: {
            type: Object,
            default: () => {}
        },
        appendToBody: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            titleDefault: '',
            descriptionDefault: '',
            configDefault: {
                descriptionIcon: 'IconQuestion',
                cancelIcon: 'IconDiscard',
                confirmIcon: 'IconConfirm',
                cancelText: this.$t('common.cancel'),
                confirmText: this.$t('common.confirm')
            }
        }
    },
    computed: {
        attrs () {
            return {
                ...this.$attrs,
                width: this.modalWidth
            }
        },
        dialogTitle () {
            return this.title || this.titleDefault
        },
        dialogDescription () {
            return this.description || this.descriptionDefault
        },
        dialogConfig () {
            return {
                ...this.configDefault,
                ...this.config
            }
        }
    },
    methods: {
        onConfirm() {
            this.$emit('on-confirm')
        },
        onCancel() {
            this.$emit('on-cancel')
        },
    },
}
