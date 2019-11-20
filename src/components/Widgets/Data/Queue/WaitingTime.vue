<template>
    <div class="flex items-center justify-center">
        <span class="font-medium tracking-wide call-time font-mono">{{timer.displayTime}}</span>
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import {ISRAEL_TIMEZONE_OFFSET} from '@/enum/generic'

    export default {
        props: {
            call: {
                type: Object,
                default: () => ({})
            },
            textColor: {
                type: String,
                default: () => 'text-gray-500'
            }
        },
        data() {
            let initialTime = new Date().getTime() - ((this.call.JoinTimeStamp * 1000) - ISRAEL_TIMEZONE_OFFSET)
            let initialTimeInSeconds = Math.floor(initialTime / 1000)
            return {
                timer: new Timer({
                    initialTimeInSeconds
                }),
                directionMappings: {
                    "Outgoing": "IconDirectionOutgoing",
                    "Incoming": "IconDirectionIncoming",
                },
            }
        },
        mounted() {
            this.timer.start()
        },
        beforeDestroy() {
            this.timer.destroy()
        }
    }
</script>
<style scoped>
    .call-time {
        min-width: 48px;
    }

    .rtl .direction-icon {
        transform: rotate(180deg);
    }
</style>
