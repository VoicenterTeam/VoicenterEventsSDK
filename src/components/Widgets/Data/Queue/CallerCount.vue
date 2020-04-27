<template>
    <div :key="queueID">
        {{getCallersCount}}
    </div>
</template>
<script>
    import get from 'lodash/get'

    export default {
        props: {
            queueID: {
                type: [Number, String],
                default: null
            }
        },
        computed: {
            getQueueByID () {
                return this.$store.getters['queues/filterQueuesByIds']([this.queueID])
            },
            getCallersCount () {
                let queueData = this.getQueueByID

                let calls = get(queueData, '[0].Calls', [])
                return calls.length
            }
        },
    }
</script>
