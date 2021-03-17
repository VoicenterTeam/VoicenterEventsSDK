<template>
    <div>
        <portal :to="`widget-header__${data.WidgetID}`">
            <div class="flex  w-full justify-end">
                <div class="-my-1 cursor-pointer hidden lg:block">
                    <div>
                        <IconCardsGrid @click.stop="showGridMenu = !showGridMenu"/>
                    </div>
                    <fade-transition :duration="250">
                        <div class="bg-white rounded mt-1 absolute flex flex-col border-2"
                             v-click-outside="onMenuClickOutside"
                             v-if="showGridMenu">
                            <div class="bg-gray-200 rounded-t border-b-2">
                                <p class="p-2 text-main-sm font-medium">{{ layoutColumns }}
                                                                        {{ $t('columns.layout') }}</p>
                            </div>
                            <div class="w-full flex p-2 justify-between">
                                <i :class="{'bg-primary-100': index <= layoutColumns}"
                                   @click="updateGrid(index)"
                                   class="icon-square mx-margin--1"
                                   v-for="index in maxLayoutColumns"/>
                            </div>
                        </div>
                    </fade-transition>
                </div>
                <el-select :placeholder="$t('Sort by')" v-model="sortBy">
                    <template v-slot:prefix>
                    <span class="h-full flex items-center">
                        <i class="el-icon-d-caret"/>
                    </span>
                    </template>
                    <el-option :key="option.label" v-bind="option" v-for="option in sortByOptions"/>
                </el-select>
            </div>
        </portal>
        <div>
            <div class="flex pt-1 extension-cards justify-center">
                <fade-transition
                    :class="{'grid-container overflow-x-auto': sortedExtensions.length, 'w-full': sortedExtensions.length === 0}"
                    :style="renderColumns"
                    class="flex flex-wrap"
                    group>
                    <div :key="index"
                         class="px-1"
                         v-for="(extension, index) in sortedExtensions">
                        <extension-card :key="extension.number" :extension="extension" :settings="getSettings"/>
                    </div>
                    <div class="flex flex-col w-full items-center"
                         key="no-data"
                         v-if="sortedExtensions.length === 0">
                        <h3 class="text-main-xl">{{ $t('extensions.noData') }}</h3>
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
    import uniqBy from 'lodash/uniqBy'
    import orderBy from 'lodash/orderBy'
    import { Option, Select } from 'element-ui'
    import { FadeTransition } from 'vue2-transitions'
    import { LOGOUT_STATUS } from '@/enum/extensionStatuses'
    import ExtensionCard from '@/components/Cards/ExtensionCard'
    import { realTimeSettings } from '@/enum/defaultWidgetSettings'
    import { ADMIN_USER_ID, displayUsersRelatedWithAdmin } from '@/helpers/util'
    
    const cardWidth = 256;
    
    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
            ExtensionCard,
            FadeTransition,
        },
        props: {
            editable: {
                type: Boolean,
                default: false,
            },
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                statusMappings: {
                    1: 'IconLogin',
                    2: 'IconLogout',
                    3: 'IconLunch',
                    5: 'IconAdministrative',
                    7: 'IconPrivate',
                    9: 'IconOther',
                    11: 'IconTraining',
                    12: 'IconTeamMeeting',
                    13: 'IconBrief',
                },
                timer: 0,
                sortBy: 'number',
                sortByOptions: [
                    {
                        label: this.$t('extensions.sort.static'),
                        value: 'number',
                    },
                    {
                        label: this.$t('extensions.sort.extension'),
                        value: 'extenUser',
                    },
                    {
                        label: this.$t('extensions.sort.activeTime'),
                        value: 'lastAnsweredCallEventEpoch',
                    },
                ],
                showGridMenu: false,
                maxLayoutColumns: 0,
                layoutColumns: 0,
            }
        },
        computed: {
            adminSelected() {
                return displayUsersRelatedWithAdmin(this.data.WidgetConfig)
            },
            extensions() {
                return this.$store.state.extensions.extensions
            },
            filteredExtensions() {
                if (this.adminSelected) {
                    return uniqBy(this.extensions, 'number')
                }
                const extensions = this.extensions.filter(ext => ext.userID !== ADMIN_USER_ID)
                return uniqBy(extensions, 'number')
            },
            onlineExtensions() {
                let showLoggedOutUsers = get(this.data.WidgetLayout.settings, 'showLoggedOutUsers')
                if (!showLoggedOutUsers) {
                    return this.filteredExtensions.filter(e => e.representativeStatus !== LOGOUT_STATUS)
                }
                return this.filteredExtensions
            },
            extensionToDisplay() {
                return get(this.data.WidgetConfig, '[0].WidgetParameterValueJson.EntityPositive', [])
            },
            sortedExtensions() {
                let extensionToDisplay = this.extensionToDisplay
                let onlineExtensions = this.onlineExtensions.filter((el) => extensionToDisplay.includes(el.number))
                return orderBy(onlineExtensions, `${this.sortBy}`, 'asc')
            },
            renderColumns() {
                let columns = ''
                times(this.layoutColumns, () => {
                    columns = columns + ' auto'
                })
                return {
                    'grid-template-columns': columns,
                }
            },
            pageWidth() {
                return this.$store.getters['utils/pageWidth']
            },
            getSettings() {
                return this.data.WidgetLayout.settings || realTimeSettings
            },
        },
        methods: {
            onMenuClickOutside() {
                this.showGridMenu = false
            },
            updateGrid(val) {
                this.layoutColumns = val
            },
        },
        watch: {
            pageWidth: {
                immediate: true,
                handler: function (val) {
                    let numCardsWhichFit = parseInt(val / cardWidth - 1)
                    this.layoutColumns = numCardsWhichFit
                    this.maxLayoutColumns = numCardsWhichFit
                },
            },
        },
    }
</script>
<style lang="scss" scoped>
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
