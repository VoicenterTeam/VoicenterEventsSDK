<template>
    <div>
        <BaseNavbar/>
        <report-tabs
            :dataTabs="dataTabs"
            :active-tab="activeTab"
            @update-active-tab="updateActiveTab"
            @on-remove-tab="removeTab">
            <template v-slot:list>
                <reports-list
                    ref="reports-list"
                    v-show="listTabName === activeTab"
                    @on-create-report="openCreateReportTab"
                    @on-edit-row="onEditRow"
                />
            </template>
            <template
                v-for="(tab, index) in editableTabs"
                v-slot:[tab.name]="{data}"
            >
                <report-edit
                    :key="index"
                    v-show="tab.name === activeTab"
                    :data="tab.data"
                    :report-id="tab.name"
                    @update-title="onUpdateTitle"
                    @on-close-create-report-tab="onCloseCreateReportTab"
                    @on-reload-data-reports-list="onReloadDataReportsList"
                />
            </template>
            <template v-slot:create>
                <report-create v-show="createTabName === activeTab" @on-close-create-report-tab="onCloseCreateReportTab" />
            </template>
        </report-tabs>
    </div>
</template>

<script>

import get from "lodash/get"
import {TabPane, Tabs} from 'element-ui'
import BaseNavbar from '@/components/Navbar/BaseNavbar'
import ReportTabs from "@/modules/reports/components/ReportTabs";

import ReportEdit from "@/modules/reports/pages/ReportEdit";
import ReportsList from "@/modules/reports/pages/ReportsList";
import ReportCreate from "@/modules/reports/pages/ReportCreate";
import { reportApi } from '@/modules/reports/services/reportService'

const CREATE_TAB_NAME = 'create';
const LIST_TAB_NAME = 'list'

export default {
    components: {
        BaseNavbar,
        [Tabs.name]:
        Tabs,
        [TabPane.name]:
        TabPane,
        ReportTabs,
        ReportEdit,
        ReportsList,
        ReportCreate,
    },
    data() {
        return {
            activeTab: LIST_TAB_NAME,
            dataTabs: [
                {
                    title: this.$t('report.tab.reportList'),
                    name: LIST_TAB_NAME,
                    icon: 'vc-icon-template-list',
                }
            ],
            createTabName: CREATE_TAB_NAME,
            listTabName: LIST_TAB_NAME,
        }
    },
    computed: {
        editableTabs() {
            return this.dataTabs.filter(t => t.name !== LIST_TAB_NAME && t.name !== CREATE_TAB_NAME);
        },
    },
    methods: {
        updateActiveTab(tab) {
            let routePath
            if (tab === LIST_TAB_NAME) {
                routePath = '/reports'
            } else if (tab === CREATE_TAB_NAME) {
                routePath = '/reports/create'
            } else {
                routePath = `/reports/edit/${tab}`

            }
            if (this.$route.path === routePath) return
            this.$router.push(routePath)
        },
        removeTab(tab) {
            const deleteIndex = this.dataTabs.findIndex(t => t.name === tab)
            if (deleteIndex !== -1 && tab !== LIST_TAB_NAME) {
                if (this.activeTab === tab) {
                    this.activeTab = LIST_TAB_NAME
                }
                this.dataTabs.splice(deleteIndex, 1)
            }
        },
        openCreateReportTab() {
            const createReportTab = this.dataTabs.find(tab => tab.name === CREATE_TAB_NAME)
            if (createReportTab) {
                this.activeTab = createReportTab.name
            } else {
                this.dataTabs.push({
                    title: this.$t('general.create'),
                    name: CREATE_TAB_NAME,
                    icon: 'vc-icon-plus-linear',
                })
                this.$nextTick(() => {
                    this.activeTab = CREATE_TAB_NAME
                })
            }
        },
        onUpdateTitle(id, title) {
            const updateIndex = this.dataTabs.findIndex(t => t.name === id)
            if (updateIndex !== -1) {
                this.dataTabs[updateIndex].title = title
            }
        },
        onEditRow(row) {
            const tabName = get(row, 'ReportID', '').toString()
            const reportName = get(row, 'ReportName', '')
            const editTabExists = this.dataTabs.find(tab => tab.name === tabName)
            if (!editTabExists) {
                this.dataTabs.push({
                    title: reportName,
                    name: tabName,
                    data: row
                })
            }
            this.$nextTick(() => {
                this.activeTab = tabName
            })
        },
        onCloseCreateReportTab () {
            this.removeTab(this.activeTab)
        },
        onReloadDataReportsList () {
            this.removeTab(this.activeTab)
            this.$refs['reports-list'].reloadData()
        },
    },
    watch: {
        '$route': {
            immediate: true,
            handler(route) {
                const routePath = route.path
                const routeEditId = route.params.id
                const createRoute = '/reports/create'
                if (routeEditId) {
                    const editTabExists = this.dataTabs.find(tab => tab.name === routeEditId)
                    if (!editTabExists) {
                        this.dataTabs.push({
                            title: routeEditId,
                            name: routeEditId
                        })
                    }
                    this.$nextTick(() => {
                        this.activeTab = routeEditId
                    })
                } else if (routePath === createRoute) {
                    this.openCreateReportTab()
                } else {
                    this.activeTab = LIST_TAB_NAME
                }
            }
        }
    },
    async mounted () {
        const confData = await reportApi.getReportConfData()
        this.$store.dispatch('reportTrigger/setConfData', confData)
        document.body.classList.add('bg-gray-200')
    },
    beforeDestroy () {
        document.body.classList.remove('bg-gray-200')
    }
}
</script>

<style lang="scss" scoped>
::v-deep html {
    background: red !important;
}
</style>
