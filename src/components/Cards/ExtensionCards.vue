<template>
    <div class="flex py-6">
        <div v-for="(extension, index) in extensions"
             :key="index"
             class="pr-4">
            <extension-card :extension="extension">
            </extension-card>
        </div>
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
        extensions: [
          {
            "calls": [
              {
                "callStarted": 1565629479,
                "calldurationinterval": 1565629479,
                "callAnswered": 1565629486,
                "answered": 1,
                "callername": "Edy",
                "callerphone": "40748524075",
                "callstatus": "Talking",
                "customdata": {},
                "direction": "Outgoing",
                "ivrid": "201908121704380136de15da4f183207",
                "recording": { "Filename": "", "Options": "", "ApproximateURL": "" },
                "did": "",
                "channel": "SIP/WPGrStO1-00003d91",
                "channel2": "SIP/ProviderProxy05-00003d92"
              },
              {
                "callStarted": 1565629479,
                "calldurationinterval": 1565629479,
                "callAnswered": 1565629486,
                "answered": 1,
                "callername": "Cristi",
                "callerphone": "40748524075",
                "callstatus": "Talking",
                "customdata": {},
                "direction": "Incoming",
                "ivrid": "201908121704380136de15da4f183207",
                "recording": { "Filename": "", "Options": "", "ApproximateURL": "" },
                "did": "",
                "channel": "SIP/WPGrStO1-00003d91",
                "channel2": "SIP/ProviderProxy05-00003d92"
              }
            ],
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
          },
          {
            "calls": [],
            "userID": 106576,
            "userName": "Second User",
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
            "representativeStatus": 1,
            "lastCallEventEpoch": 1565625369,
            "lastAnsweredCallEventEpoch": 0,
            "representativeUpdated": 1565625372000,
            "peerStatus": "OK"
          },
          {
            "calls": [],
            "userID": 106576,
            "userName": "Second User",
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
            "representativeStatus": 2,
            "lastCallEventEpoch": 1565625369,
            "lastAnsweredCallEventEpoch": 0,
            "representativeUpdated": 1565625372000,
            "peerStatus": "OK"
          }
        ]
      }
    }
  }
</script>
<style>
</style>
