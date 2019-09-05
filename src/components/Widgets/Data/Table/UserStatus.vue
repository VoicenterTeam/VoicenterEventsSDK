<template>
    <div>
        <span>{{statusText}}</span>
    </div>
</template>

<script>
    import statusTypes from "@/enum/statusTypes";

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
        data() {
            return {
                statusMappings: statusTypes,
            }
        },
        computed: {
            statusText() {
                let data = this.statusMappings[this.extension.representativeStatus] || {text: ''}
                let text = data.text

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
