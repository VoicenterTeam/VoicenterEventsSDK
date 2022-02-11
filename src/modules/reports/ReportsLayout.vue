<template>
    <div>
        <BaseNavbar/>
        <report-tabs :dataTabs="dataTabs"
                     :active-tab="activeTab"
                     @update-active-tab="updateActiveTab"
                     @on-remove-tab="removeTab">
            <template v-slot:list>
                <list-temp @on-create-report="openCreateReportTab" @on-edit-row="onEditRow" />
            </template>

            <template v-for="tab in editableTabs"
                      v-slot:[tab.name]="{data}">
                <edit-temp :data="tab.data" :report-id="tab.name" @update-title="onUpdateTitle" />
            </template>

            <template v-slot:create>
                <create-temp/>
            </template>
        </report-tabs>
    </div>
</template>
<script>
import BaseNavbar from '@/components/Navbar/BaseNavbar'
import ReportTabs from "@/modules/reports/ReportTabs";
/*import EditableTabs from '@/modules/common/components/EditableTabs'*/
import EditTemp from "@/modules/reports/EditTemp";
import ListTemp from "@/modules/reports/ListTemp";
import CreateTemp from "@/modules/reports/CreateTemp";

import {TabPane, Tabs} from 'element-ui'

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
        EditTemp,
        ListTemp,
        CreateTemp
    },
    data() {
        return {
            activeTab: LIST_TAB_NAME,
            dataTabs: [
                {
                    title: 'Report List',
                    name: LIST_TAB_NAME,
                    icon: 'vc-icon-template-list',
                },
                /*{
                    title: 'momo',
                    name: '10',
                    icon: 'vc-icon-template-list',
                },
                {
                    title: 'lolo',
                    name: '49',
                    icon: 'vc-icon-template-list',
                },*//*
                {
                    title: 'Create',
                    name: CREATE_TAB_NAME,
                    icon: 'vc-icon-plus-linear',
                }*/
            ],
            createTabName: CREATE_TAB_NAME,
            listTabName: LIST_TAB_NAME
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
            if (tab === this.listTabName) {
                routePath = '/reports'
            } else if (tab === this.createTabName) {
                routePath = '/reports/create'
            } else {
                routePath = `/reports/edit/${tab}`
            }
            if (this.$route.path === routePath) return

            this.$router.push(routePath)
            //this.activeTab = tab
        },
        removeTab(tab) {
            const deleteIndex = this.dataTabs.findIndex(t => t.name === tab)
            console.log('deleteIndex', deleteIndex)
            if (deleteIndex !== -1 && tab !== LIST_TAB_NAME) {
                if (this.activeTab === tab) {
                    this.activeTab = LIST_TAB_NAME
                }
                this.dataTabs.splice(deleteIndex, 1)
            }
        },
        openCreateReportTab() {
            const createReportTab = this.dataTabs.find(tab => tab.name === this.createTabName)
            if (createReportTab) {
                this.activeTab = createReportTab.name
            } else {
                this.dataTabs.push({
                    title: 'Create',
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

            console.log('onUpdateTitle', id, title)
            if (updateIndex !== -1) {
                this.dataTabs[updateIndex].title = title
            }
        },
        onEditRow(row) {
            const editTabExists = this.dataTabs.find(tab => tab.name === row.id)

            if (!editTabExists) {
                this.dataTabs.push({
                    title: row.name,
                    name: row.id,
                    data: row,
                    icon: 'vc-icon-template-list',
                })
            }

            this.$nextTick(() => {
                this.activeTab = row.id
            })
        }
    },
    watch: {
        '$route': {
            immediate: true,
            handler(route) {
                const routePath = route.path
                const routeEditId = route.params.id

                const baseRoute = '/reports'
                const createRoute = '/reports/create'

                if (routeEditId) {
                    //const editRoute = baseRoute + '/edit/' + routeEditId
                    const editTabExists = this.dataTabs.find(tab => tab.name === routeEditId)

                    if (!editTabExists) {
                        this.dataTabs.push({
                            title: routeEditId,
                            name: routeEditId,
                            icon: 'vc-icon-template-list',
                        })
                    }

                    this.$nextTick(() => {
                        this.activeTab = routeEditId
                    })

                    /*{
                    title: 'momo',
                    name: '10',
                    icon: 'vc-icon-template-list',
                }*/


                } else if (routePath === createRoute) {
                    this.openCreateReportTab()
                } else {
                    this.activeTab = LIST_TAB_NAME
                }


                /*console.log('route.path', route.path)
                const baseRoute = '/reports'
                console.log('route.params.id', route.params.id)
                if (!route.params.id) return

                const editRoute = baseRoute + '/edit/' + route.params.id
                if (route.path === editRoute) {
                    this.activeTab = route.params.id
                }*/
            }
        }
    },
    mounted() {
        /*const routePath = this.$route.path
        const routeEditId = this.$route.params.id

        const baseRoute = '/reports'
        const createRoute = '/reports/create'

        if (routeEditId) {
            const editRoute = baseRoute + '/edit/' + routeEditId


        } else if (routePath === createRoute) {
            this.openCreateReportTab()
        } else {
            this.activeTab = LIST_TAB_NAME
        }*/


    }
}
</script>
