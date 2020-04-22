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
            stats() {
                let queueData = this.getQueueByID
                let calls = get(queueData, '[0].Calls', [])

                let minJoinTimestamp = getMinValue(calls, 'JoinTimeStamp')
                minJoinTimestamp = getInitialTime(minJoinTimestamp)

                return {
                    minJoinTimestamp,
                    calls
                }
            },
            maxWaitTime() {
                return this.timer.displayTime
            },
        },
        methods: {
            setCounterState(callCount) {
                this.timer.setValue(this.stats.minJoinTimestamp)
                if (callCount === 0) {
                    this.timer.stop()
                } else {
                    this.timer.start()
                }
            }
        },
        watch: {
          'stats.calls': {
              immediate: true,
              handler(calls) {
                  this.setCounterState(calls.length)
              }
          }
        },
        beforeDestroy () {
            this.timer.destroy()
        },
    }
</script>
