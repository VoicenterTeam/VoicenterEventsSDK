<template>
    <div>
        <div class="flex w-full justify-between pr-12 -mt-0-5 items-center" :class="responsiveClass">
            <base-widget-title :title="data.Title"/>
            <div class="flex">
                <div class="mx-1 -my-1 cursor-pointer hidden lg:block">
                    <div>
                        <IconCardsGrid @click.stop="showGridMenu = !showGridMenu"/>
                    </div>
                    <fade-transition :duration="250">
                        <div v-if="showGridMenu"
                             v-click-outside="onMenuClickOutside"
                             class="bg-white rounded mt-1 absolute flex flex-col border-2">
                            <div class="bg-gray-200 rounded-t border-b-2">
                                <p class="p-2 text-main-sm font-medium">{{layoutColumns}} {{$t('columns.layout')}}</p>
                            </div>
                            <div class="w-full flex p-2 justify-between">
                                <i v-for="index in maxLayoutColumns"
                                   class="icon-square mx-margin--1"
                                   :class="{'bg-primary-100': index <= layoutColumns}"
                                   @click="updateGrid(index)"/>
                            </div>
                        </div>
                    </fade-transition>
                </div>
                <el-select placeholder="Sort by" v-model="sortBy">
                    <template v-slot:prefix>
                    <span class="h-full flex items-center">
                        <i class="el-icon-d-caret"/>
                    </span>
                    </template>
                    <el-option v-for="option in sortByOptions" v-bind="option" :key="option.label"/>
                </el-select>
            </div>
        </div>
        <div>
            <div class="flex pt-1 extension-cards justify-center">
                <fade-transition class="flex flex-wrap" group
                                 :style="renderColumns"
                                 :class="{'grid-container overflow-x-auto': sortedExtensions.length, 'w-full': sortedExtensions.length === 0}">
                    <div v-for="(extension, index) in sortedExtensions"
                         :key="index"
                         class="px-1">
                        <extension-card :extension="extension" :settings="getSettings"/>
                    </div>
                    <div key="no-data"
                         class="flex flex-col w-full items-center"
                         v-if="sortedExtensions.length === 0">
                        <h3 class="text-main-xl">{{$t('extensions.noData')}}</h3>
                        <icon-no-data class="w-64"/>
                    </div>
                </fade-transition>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import times from 'lodash/times'
    import orderBy from 'lodash/orderBy'
    import {Select, Option} from 'element-ui'
    import {FadeTransition} from 'vue2-transitions'
    import {LOGOUT_STATUS} from '@/enum/extensionStatuses'
    import ExtensionCard from '@/components/Cards/ExtensionCard'
    import {realTimeSettings} from '@/enum/defaultWidgetSettings'

    const cardWidth = 256;

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
            ExtensionCard,
            FadeTransition
        },
        props: {
            editable: {
                type: Boolean,
                default: false
            },
            data: {
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
                        value: 'lastAnsweredCallEventEpoch'
                    }
                ],
                showGridMenu: false,
                maxLayoutColumns: 0,
                layoutColumns: 0,
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
                let showLoggedOutUsers = get(this.data.WidgetLayout.settings, 'showLoggedOutUsers')
                if (!showLoggedOutUsers) {
                    return this.extensions.filter(e => e.representativeStatus !== LOGOUT_STATUS)
                }
                return this.extensions
            },
            sortedExtensions() {
                return orderBy(this.onlineExtensions, this.sortBy, 'asc')
            },
            responsiveClass() {
                if (this.editable && this.$rtl.isRTL) {
                    return 'pl-24 mx-2'
                }
                if (this.$rtl.isRTL) {
                    return 'pl-24'
                }
                if (this.editable) {
                    return 'pr-24'
                }
            },
            renderColumns() {
                let columns = ''
                times(this.layoutColumns, () => {
                    columns = columns + ' auto'
                })
                return {
                    'grid-template-columns': columns
                }
            },
            pageWidth() {
                return this.$store.getters['utils/pageWidth']
            },
            getSettings() {
                return this.data.WidgetLayout.settings || realTimeSettings
            }
        },
        methods: {
            onMenuClickOutside() {
                this.showGridMenu = false
            },
            updateGrid(val) {
                this.layoutColumns = val
            }
        },
        watch: {
            pageWidth: {
                immediate: true,
                handler: function (val) {
                    let numCardsWhichFit = parseInt(val / cardWidth - 1)
                    this.layoutColumns = numCardsWhichFit
                    this.maxLayoutColumns = numCardsWhichFit
                }
            },
        },
    }
</script>
<style scoped lang="scss">
    .icon-square {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        border: 2px solid var(--silver-color);

        &:hover {
            background: var(--silver-color);
            border: 2px solid var(--primary-color);
        }
    }

    .mx-margin--1 {
        margin-right: 1px;
        margin-left: 1px;
    }

    .grid-container {
        display: grid;
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

    .el-row {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
