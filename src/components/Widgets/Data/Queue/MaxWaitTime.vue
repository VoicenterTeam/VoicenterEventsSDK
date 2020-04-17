<template>
    <div>
        {{getMaxWaitTime}}
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {getInitialTime} from "@/util/timeUtils";
    import {timeFormatter} from "@/helpers/timeFormatter";
    import {getMinValue} from "@/helpers/util";

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
                dataCount: timeFormatter(0)
            }
        },
        computed: {
            getQueueByID() {
                return this.$store.getters['queues/filterQueuesByIds']([this.queueID])
            },
            getMaxWaitTime () {
                clearInterval(this.timeout)
                let queueData = this.getQueueByID
                let calls = get(queueData, '[0].Calls', [])

                if(!calls.length) {
                    return timeFormatter(0)
                }

                let minJoinTimeStamp = getMinValue(calls, 'JoinTimeStamp')

                this.dataCount = getInitialTime(minJoinTimeStamp)

                this.timeout = setInterval(() => {
                    this.dataCount++
                }, 1000)

                this.dataCount = timeFormatter(this.dataCount)
                return this.dataCount
            }
        },
        beforeDestroy () {
            clearInterval(this.timeout)
        },
    }
</script>
