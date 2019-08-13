<template>
    <div class="bg-white px-6 p-4 rounded-lg shadow w-64 extension-card" :style="cardStyles">
        <div class="flex items-center">
            <fade-transition mode="out-in">
                <component :is="statusIcon"
                           :key="extension.representativeStatus"
                           :class="{'is-calling': isCalling, 'is-talking': isTalking}"
                           class="extension-card-icon">
                </component>
            </fade-transition>
            <span class="text-xl font-medium ml-2">{{extension.userName}}</span>
        </div>
        <div class="flex flex-col">
            <span class="text-center text-2xl font-bold ml-2 font-mono">{{timer.displayTime}}</span>
            <call-info v-for="(call, index) in extension.calls" :key="index" :call="call"/>
        </div>
    </div>
</template>
<script>
  import CallInfo from './CallInfo'
  import Timer from './Timer'

  export default {
    components: {
      CallInfo
    },
    props: {
      extension: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      let israelTimezoneOffset = -180*60*1000
      let initialTime = new Date().getTime() - (this.extension.representativeUpdated + israelTimezoneOffset)
      let initialTimeInSeconds = Math.floor(initialTime/1000)
      return {
        timer: new Timer({
          initialTimeInSeconds
        }),
        statusMappings: {
          1: {
            icon: "IconLogin",
            color: '#5EB300'
          },
          2: {
            icon: "IconLogout",
            color: '#888F9D'
          },
          3: {
            icon: "IconLunch"
          },
          5: {
            icon: "IconAdministrative"
          },
          7: {
            icon: "IconPrivate",
            color: '#FF4D4D'
          },
          9: {
            icon: "IconOther"
          },
          11: {
            icon: "IconTraining"
          },
          12: {
            icon: "IconTeamMeeting"
          },
          13: {
            icon: "IconBrief"
          },
        },
      }
    },
    computed: {
      cardStyles() {
        let data = this.statusMappings[this.extension.representativeStatus] || { color: 'white' }
        return {
          border: `2px solid ${data.color}`
        }
      },
      statusIcon() {
        let data = this.statusMappings[this.extension.representativeStatus] || { icon: 'IconOther' }
        if (this.extension.calls.length > 0) {
          return 'IconIncomingCall'
        }
        return data.icon
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
    },
    watch: {
      'extension.representativeStatus'(newVal, oldVal) {
        this.timer.reset()
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
    .extension-card {
        min-height: 200px;
        transition: all .2s;
    }
    .extension-card-icon {
        max-width: 48px;
        width: 48px;
    }
</style>
<style lang="scss">
    @keyframes fade {
        0%   {opacity: 0;}
        100% {opacity: 1;}
    }
    .extension-card-icon.is-calling {
        path:first-child {
            animation: fade 1s;
        }
        path:last-child {
            opacity: 0;
            animation: fade 1s infinite;
            animation-direction: alternate;
            animation-delay: 1s;
        }
    }
</style>
