<template>
    <div>
        <div class="flex w-full justify-end pr-12"
             :class="responsiveClass">
            <el-select placeholder="Sort by" v-model="sortBy">
                <template v-slot:prefix>
                    <span class="h-full flex items-center">
                        <i class="el-icon-d-caret"></i>
                    </span>
                </template>
                <el-option v-for="option in sortByOptions" v-bind="option" :key="option.label"></el-option>
            </el-select>
        </div>
        <div>
            <div class="flex py-6 extension-cards">
                <fade-transition class="flex flex-wrap w-full" group>
                    <div v-for="(extension, index) in sortedExtensions"
                         :key="index"
                         class="pr-4">
                        <extension-card :extension="extension">
                        </extension-card>
                    </div>
                    <div key="no-data"
                         class="flex flex-col w-full items-center"
                         v-if="sortedExtensions.length === 0">
                        <h3 class="text-xl">{{$t('extensions.noData')}}</h3>
                        <icon-no-data class="w-64"></icon-no-data>
                    </div>
                </fade-transition>
            </div>
        </div>
    </div>
</template>
<script>
    import {Select, Option} from 'element-ui'
    import {FadeTransition} from 'vue2-transitions'
    import ExtensionCard from "@/components/Cards/ExtensionCard";

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
            ExtensionCard,
            FadeTransition
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
                sortBy: 'userID',
                sortByOptions: [
                    {
                        label: this.$t('extensions.sort.default'),
                        value: 'userID'
                    },
                    {
                        label: this.$t('extensions.sort.userName'),
                        value: 'userName'
                    },
                    {
                        label: this.$t('extensions.sort.activeTime'),
                        value: 'representativeUpdated'
                    }
                ]
            }
        },
        computed: {
            token() {
                return this.$store.state.users.tokenString
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
            onlineExtensions() {
                let logoutStatus = 2
                return this.extensions.filter(e => e.representativeStatus !== logoutStatus)
                // return this.extensions.filter(e => e.representativeStatus !== authStatuses.LOGGED_OUT)
            },
            sortedExtensions() {

                return [
                    {"calls":[{"callStarted":1566919119 + 3 * 3600,"calldurationinterval":1566922358,"callAnswered":1566919119,"answered":1,"callername":"40748524075","callerphone":"40748524075","callstatus":"Talking","customdata":{},"direction":"Outgoing","ivrid":"2019082716123701364452702b3fefd6","recording":{"Filename":"","Options":"","ApproximateURL":""},"did":"","channel":"SIP/WPGrStO1-00003f45","channel2":"SIP/ProviderProxy05-00003f46"}],"userID":106576,"userName":"Cristi Jora","number":71793,"extenUser":"WPGrStO1","summery":{"isOpenser":false,"representative":"Cristi Jora","shiftentertime":null,"ttlabnormal":"N/A","ttlbreaks":"N/A","ttlcalls":0,"ttlincoming":0,"ttloutgoing":0,"ttltimeofbreaks":"N/A"},"representative":106576,"representativeStatus":1,"lastCallEventEpoch":1566922367,"lastAnsweredCallEventEpoch":1566922367,"representativeUpdated":1566921691000,"peerStatus":"OK"},
                {"calls":[],"userID":88128,"userName":"Dorel Mizrahi 59","number":55791,"extenUser":"xds5nsQF","summery":{"isOpenser":false,"representative":"dorel mizrahi","shiftentertime":null,"ttlabnormal":"N/A","ttlbreaks":"N/A","ttlcalls":0,"ttlincoming":0,"ttloutgoing":0,"ttltimeofbreaks":"N/A"},"representative":88128,"representativeStatus":5,"lastCallEventEpoch":1566917014,"lastAnsweredCallEventEpoch":1566917014,"representativeUpdated":1566896855000,"peerStatus":"OK"},
                {"calls":[],"userID":88128,"userName":"Dorel Cell Mizrahi - 0534308463","number":56482,"extenUser":"gJn2n646","summery":{"isOpenser":false,"representative":"Dorel Cell Mizrahi - 0534308463","shiftentertime":null,"ttlabnormal":"N/A","ttlbreaks":"N/A","ttlcalls":0,"ttlincoming":0,"ttloutgoing":0,"ttltimeofbreaks":"N/A"},"representative":0,"representativeStatus":2,"lastCallEventEpoch":1566821989,"lastAnsweredCallEventEpoch":1566821989,"representativeUpdated":1566896855000,"peerStatus":"OK"},
                {"calls":[],"userID":87112,"userName":"Maor Laptop","number":54856,"extenUser":"a5Bcv7bo","summery":{"isOpenser":false,"representative":"Maor Laptop","shiftentertime":null,"ttlabnormal":"N/A","ttlbreaks":"N/A","ttlcalls":0,"ttlincoming":0,"ttloutgoing":0,"ttltimeofbreaks":"N/A"},"representative":87112,"representativeStatus":1,"lastCallEventEpoch":1566921163,"lastAnsweredCallEventEpoch":1566824550,"representativeUpdated":1566908821000,"peerStatus":"OK"}]

                if (!this.sortBy) {
                    return this.onlineExtensions.sort((a, b) => {

                    })
                }
                return this.onlineExtensions.sort((a, b) => {
                    let aValue = a[this.sortBy]
                    let bValue = b[this.sortBy]
                    if (typeof aValue === 'number') {
                        return aValue - bValue
                    }
                    if (typeof aValue === 'string') {
                        return aValue.localeCompare(bValue)
                    }
                    return 0
                })
            },
            responsiveClass() {
                if (this.editable && this.$rtl.isRTL) {
                    return 'pl-24 mx-2'
                }
                if (this.$rtl.isRTL) {
                    return 'pl-12'
                }
                if (this.editable) {
                    return 'pr-24'
                }
            }
        }
    }
</script>
<style scoped>
    .extension-cards {
        min-height: 280px;
    }
</style>
<style lang="scss">
    .flip-list-move {
        transition: transform 5s;
    }

    .el-loading-mask .el-loading-spinner {
        display: flex;
        justify-content: center;
    }
</style>
