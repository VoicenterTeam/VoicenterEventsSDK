<template>
    <span>{{$t(statusText)}}</span>
</template>

<script>

    export default {
        props: {
            userId: {
                type: Number,
                default: null
            },
            extension: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            statusText() {
                let text = this.$store.getters['entities/getStatusTextById'](this.extension.representativeStatus)

                if (this.extension.calls && this.isTalking) {
                    text = 'status.talking'
                }
                if (this.extension.calls && this.isCalling) {
                    text = 'status.calling'
                }
                return this.$t(text)
            },
            isCalling() {
                if (this.extension.calls.length === 0) {
                    return false
                }
                return this.extension.calls.every(c => c.callAnswered === 0)
            },
            isTalking() {
                if (this.extension.calls.length === 0) {
                    return false
                }
                return this.extension.calls.every(c => c.callAnswered !== 0)
            }
        }
    }
</script>
