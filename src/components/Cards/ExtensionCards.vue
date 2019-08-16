<template>
    <div class="flex py-6 extension-cards">
        <fade-transition mode="out-in" group class="flex flex-wrap">
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
    computed: {
      token() {
        return this.$store.state.users.tokenString
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
      this.sdk = new EventsSDK({
        token: this.token
      })
      await this.sdk.init()
      await this.sdk.login()
      this.sdk.on('*', this.onNewEvent)
    }
  }
</script>
<style scoped>
    .extension-cards {
        min-height: 280px;
    }
</style>
