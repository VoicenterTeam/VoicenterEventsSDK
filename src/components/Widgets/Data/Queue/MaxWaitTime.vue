<template>
    <div class="flex justify-center">
        {{maxWaitTime}}
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {getInitialTime} from "@/util/timeUtils";
    import {getMinValue} from "@/helpers/util";
    import Timer from "@/util/Timer";

    export default {
        props: {
            queueID: {
                type: [Number, String],
                default: null
            }
        },
        data () {
            return {
                timeout: null,
                timer: new Timer(),
            }
        },
        computed: {
            getQueueByID () {
                return this.$store.getters['queues/filterQueuesByIds']([this.queueID])
            },
            allQueueCalls () {
                return this.$store.getters['queues/allQueueCalls']
            },
            maxWaitTime () {
                return this.timer.displayTime
            },
            queueCalls () {
                let calls = []

                if (this.queueID === 'All') {
                    calls = this.allQueueCalls
                } else {
                    calls = get(this.getQueueByID, '[0].Calls', [])
                }
                return calls
            }
        },
        methods: {
            getStats () {
                let calls = this.queueCalls

                let minJoinTimestamp = new Date().getTime() * 10000

                if (calls.length) {
                    minJoinTimestamp = getMinValue(calls, 'JoinTimeStamp')
                }
                minJoinTimestamp = getInitialTime(minJoinTimestamp)

                return {
                    minJoinTimestamp,
                    calls
                }
            },
            setCounterState (calls) {
                const stats = this.getStats()
                this.timer.stop()
                this.timer.setValue(stats.minJoinTimestamp)
                if (calls.length !== 0) {
                    this.timer.start()
                }
            }
        },
        watch: {
            queueCalls: {
                deep: true,
                immediate: true,
                handler (calls) {
                    this.setCounterState(calls)
                }
            }
        },
        beforeDestroy () {
            this.timer.destroy()
        },
    }
</script>
