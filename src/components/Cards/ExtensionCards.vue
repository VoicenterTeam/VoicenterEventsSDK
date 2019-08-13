<template>
    <div class="flex py-6 extension-cards">
        <fade-transition mode="out-in" group>
            <div v-for="(extension, index) in extensions"
                 :key="index"
                 class="pr-4">
                <extension-card :extension="extension">
                </extension-card>
            </div>
        </fade-transition>
    </div>
</template>
<script>
  import ExtensionCard from "@/components/Cards/ExtensionCard";
  import EventsSDK from 'voicenter-events-sdk'
  export default {
    components: {
      ExtensionCard
    },
    props: {},
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
        timer: 0,
        extensions: []
      }
    },
    methods: {
      onNewEvent(eventData) {
        let { name, data} = eventData
        if (name === 'AllExtensionsStatus') {
          this.extensions = data.extensions
        }
        if (name === 'ExtensionEvent') {
           let extension = data.data
           let index = this.extensions.findIndex(e => e.userID === extension.userID)
           if (index !== -1) {
             this.extensions.splice(index, 1, extension)
           }
        }
      }
    },
    async created() {
      let token = 'sNiO6yTnVN7sPVRRN4W5IPJPrWDc4cs8odjqNQiWB5VReam4YX7CsnZvTTWizyu0tKKVGkUZHyigo1rs0cn7WSX7e5hbvOrF4o4Y'
      this.sdk = new EventsSDK({
        token: token,
        debug: true
      })
      await this.sdk.init()
      await this.sdk.login()
      this.sdk.on('*', this.onNewEvent)
    }
  }
</script>
<style scoped>
    .extension-cards {
        min-height: 250px;
    }
</style>
