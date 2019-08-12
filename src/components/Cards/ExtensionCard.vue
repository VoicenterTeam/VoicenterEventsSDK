<template>
    <div class="bg-white px-6 p-4 rounded-lg shadow w-64 h-48">
        <div class="flex items-center">
            <fade-transition mode="out-in">
                <component :is="statusMappings[extension.representativeStatus]"
                           :key="extension.representativeStatus"
                           class="w-12">
                </component>
            </fade-transition>
            <span class="text-xl font-medium ml-2">{{extension.userName}}</span>
        </div>
        <div class="flex flex-col">
            <span class="text-center text-2xl font-medium ml-2 tracking-wide">{{displayTime}}</span>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      extension: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        statusMappings: {
          1: "IconLogin",
          2: "IconLogout",
          3: "IconLunch",
          5: "IconAdministrative",
          7: "IconPrivate",
          9: "IconOther",
          11: "IconTraining",
          12: "IconTeamMeeting",
          13: "IconBrief",
        },
        widgetTimeInSeconds: 0
      }
    },
    computed: {
      displayTime() {
        let minutes = Math.round(this.widgetTimeInSeconds / 60)
        let seconds = Math.round(this.widgetTimeInSeconds % 60)
        if (minutes < 10) {
          minutes = `0${minutes}`
        }
        if (seconds < 10) {
          seconds = `0${seconds}`
        }
        return `${minutes}:${seconds}`
      }
    },
    methods: {
      resetWidgetTime() {
        this.widgetTimeInSeconds = 0
      }
    },
    watch: {
      'extension.representativeStatus'(newVal, oldVal) {
         this.resetWidgetTime()
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.widgetTimeInSeconds++
      }, 1000)
    },
    beforeDestroy() {
      clearInterval(this.interval)
    }
  }
</script>
<style>
</style>
