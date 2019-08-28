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
            },
            sortedExtensions() {
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
