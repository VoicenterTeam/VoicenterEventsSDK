<template>
    <div>
        <div class="flex w-full justify-end pr-12" :class="responsiveClass">
            <div class="mx-1 -my-1 cursor-pointer">
                <div>
                    <IconCardsGrid @click.stop="showGridMenu = !showGridMenu"></IconCardsGrid>
                </div>
                <fade-transition :duration="250">
                    <div v-if="showGridMenu"
                         v-click-outside="onMenuClickOutside"
                         class="bg-white rounded mt-1 absolute w-56 flex flex-col border-2">
                        <div class="bg-gray-200 rounded-t border-b-2">
                            <p class="p-2 text-sm font-medium">{{layoutColumns}} {{$t('columns.layout')}}</p>
                        </div>
                        <div class="flex items-center py-2">
                            <i v-for="index in maxLayoutColumns"
                               class="icon-square mx-margin--1"
                               :class="{'bg-primary-100': index <= layoutColumns}"
                               @click="updateGrid(index)"></i>
                        </div>
                    </div>
                </fade-transition>
            </div>
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
            <div class="flex py-6">
                <fade-transition class="flex flex-wrap w-full " group
                                 :style="renderColumns"
                                 :class="{'grid-container overflow-x-auto': sortedExtensions.length}">
                    <div v-for="(extension, index) in sortedExtensions"
                         :key="index"
                         class="pr-4">
                        <extension-card :extension="extension"></extension-card>
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

    import times from 'lodash/times'
    import orderBy from 'lodash/orderBy'
    import {Select, Option} from 'element-ui'
    import {FadeTransition} from 'vue2-transitions'
    import ExtensionCard from '@/components/Cards/ExtensionCard'

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
                        value: 'representativeUpdated'
                    }
                ],
                showGridMenu: false,
                maxLayoutColumns: 10,
                layoutColumns: 5
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
                if (!this.$store.state.dashboards.settings.showLoggedOutUsers) {
                    let logoutStatus = 2
                    return this.extensions.filter(e => e.representativeStatus !== logoutStatus)
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
            }
        },
        methods: {
            onMenuClickOutside() {
                this.showGridMenu = false
            },
            updateGrid(val) {
                this.layoutColumns = val
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

    .el-row {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

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
