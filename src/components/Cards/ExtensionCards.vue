<template>
    <div>
        <extension-card v-for="(extension, index) in extensions"
                        :key="index"
                        :extension="extension">
        </extension-card>
    </div>
</template>
<script>
  import ExtensionCard from "@/components/Cards/ExtensionCard";

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
        extensions: [{
          "calls": [],
          "userID": 106576,
          "userName": "Cristi Jora",
          "number": 71793,
          "extenUser": "WPGrStO1",
          "summery": {
            "isOpenser": false,
            "representative": "Cristi Jora",
            "shiftentertime": null,
            "ttlabnormal": "N/A",
            "ttlbreaks": "N/A",
            "ttlcalls": 0,
            "ttlincoming": 0,
            "ttloutgoing": 0,
            "ttltimeofbreaks": "N/A"
          },
          "representative": 106576,
          "representativeStatus": 7,
          "lastCallEventEpoch": 1565625369,
          "lastAnsweredCallEventEpoch": 0,
          "representativeUpdated": 1565625372000,
          "peerStatus": "OK"
        }]
      }
    }
  }
</script>
<style>
</style>
