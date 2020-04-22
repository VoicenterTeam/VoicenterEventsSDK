<template>
    <div>
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
        data() {
            return {
                timeout: null,
                timer: new Timer(),
            }
        },
        computed: {
            getQueueByID() {
                return this.$store.getters['queues/filterQueuesByIds']([this.queueID])
            },
            maxWaitTime() {
                return this.timer.displayTime
            },
            callCount() {
                let calls = get(this.getQueueByID, '[0].Calls', [])
                return calls.length
            }
        },
        methods: {
            getStats() {
                let calls = get(this.getQueueByID, '[0].Calls', [])

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
            setCounterState(callCount) {
                const stats = this.getStats()
                this.timer.stop()
                this.timer.setValue(stats.minJoinTimestamp)
                if (callCount !== 0) {
                    this.timer.start()
                }
            }
        },
        watch: {
            callCount: {
              immediate: true,
              handler(callCount) {
                  this.setCounterState(callCount)
              }
          }
        },
        beforeDestroy () {
            this.timer.destroy()
        },
    }
</script>
