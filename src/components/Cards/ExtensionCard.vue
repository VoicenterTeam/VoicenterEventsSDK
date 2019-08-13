<template>
    <div class="bg-white px-6 p-4 rounded-lg shadow w-64 extension-card" :style="cardStyles">
        <div class="flex items-center">
            <fade-transition mode="out-in">
                <component :is="statusIcon"
                           :key="extension.representativeStatus"
                           class="w-12">
                </component>
            </fade-transition>
            <span class="text-xl font-medium ml-2">{{extension.userName}}</span>
        </div>
        <div class="flex flex-col">
            <span class="text-center text-2xl font-medium ml-2 tracking-wide">{{timer.displayTime}}</span>
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
      return {
        timer: new Timer(),
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
        return data.icon
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
</style>
