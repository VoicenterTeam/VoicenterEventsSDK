<template>
    <div :key="queueID">
        {{getMaxWaitTime}}
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {getInitialTime} from "@/util/timeUtils";
    import {timeFormatter} from "@/helpers/timeFormatter";

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

                let minJoinTimeStamp = this.getMinValue(calls, 'JoinTimeStamp')

                this.dataCount = getInitialTime(minJoinTimeStamp)

                this.timeout = setInterval(() => {
                    this.dataCount++
                }, 1000)

                this.dataCount = timeFormatter(this.dataCount)
                return this.dataCount
            }
        },
        methods: {
            getMinValue (data, key) {
                return data.reduce((min, object) => Math.min(min, object[key]), data[0][key]);
            }
        },
        beforeDestroy () {
            clearInterval(this.timeout)
        },
    }
</script>
