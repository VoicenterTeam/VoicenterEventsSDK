<template>
    <div class="flex items-start justify-between mt-2">
        <div class="flex flex-col">
            <span class="text-gray-500 text-xs mr-2">+{{call.callerphone}}</span>
            <span v-if="call.callerphone !== call.callername" class="text-xs font-medium">{{call.callername}}</span>
        </div>
        <component :is="directionMappings[call.direction]" class="w-6"></component>
        <span class="font-medium tracking-wide call-time">{{timer.displayTime}}</span>
    </div>
</template>
<script>
  import Timer from './Timer'
  export default {
    props: {
      call: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        timer: new Timer(),
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
        width: 48px;
    }
</style>
