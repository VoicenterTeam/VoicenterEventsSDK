<template>
    <div>
        <BaseNavbar/>
        <div class="my-10 mx-10 xl:mx-20">
            <!--            <editable-tabs ref="tab"
                                       @on-change="onChangeTab"
                                       @on-tab-remove="onRemoveTab"
                                       :active-tab="activeTab"
                                       :options="availableTabs">
                            <template v-slot:edit>
                                {{ edit }}
                            </template>
                        </editable-tabs>
                        <fade-transition mode="out-in"
                                         :duration="300">
                            <router-view @on-update-tabs="onUpdateTabs"
                                         @reset-state="goToList"/>
                        </fade-transition>-->
            <el-tabs v-model="activeTabName"
                     square
                     closable>
                <el-tab-pane
                    class="editable-tab"
                    v-for="item in dataTabs"
                    :key="item.id"
                    :label="item.title"
                    :name="item.id"
                    :closable="item.name !== 'create' && item.name !== 'list'">
                    <span slot="label">
                        <i :class="item.icon" class="icon-md"/> {{ item.title }}
                    </span>
                    <template>
                        <component :is="item.component" />
                        <!--                        <slot :name="item.name"
                                                      :label="item.title"
                                                      :data="item.data">
                                                    Hello content
                                                </slot>-->
                        <!--                        <div class="w-full bg-active-elements">hello</div>-->
<!--                        <router-view @on-update-tabs="onUpdateTabs"
                                     @reset-state="goToList"/>-->
                    </template>
                    <!--                    <div slot="label"
                                             v-else>
                                            <div class="inline-block">
                                                <div class="flex items-center">
                                                    <i v-if="item.icon" :class="item.icon" class="icon-base inline-block mx-1 tab-icon"/>
                                                    <i v-else class="vc-edit-pencil icon-base inline-block mx-1 tab-icon"/>
                                                    <span class="inline-block select-none">{{ item.title }}</span>
                                                </div>
                                            </div>
                                        </div>-->
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import BaseNavbar from '@/components/Navbar/BaseNavbar'
/*import EditableTabs from '@/modules/common/components/EditableTabs'*/
import EditTemp from "@/modules/reports/EditTemp";
import ListTemp from "@/modules/reports/ListTemp";

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
            ],
            createTabName: CREATE_TAB_NAME,
            listTabName: LIST_TAB_NAME
        }
    },

}


/*
const REPORT_CREATION_TAB = {
    title: 'New Report',
    name: 'reports-create',
    id: 'create',
    icon: 'IconStore',
}

const REPORT_EDIT_TAB = {
    name: 'reports-edit',
    id: 'edit',
    icon: 'IconEdit',
}

const REPORT_LIST_TAB = {
    title: 'Report List',
    name: 'list',
    id: 'list',
    icon: 'vc-icon-template-list',
}

const AVAILABLE_ROUTES = {
    'list': '/reports',
    'create': '/reports/create',
}

export default {
    components: {
        BaseNavbar,
        /!*EditableTabs,*!/
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
    },
    data() {
        return {
            REPORT_CREATION_TAB,
            activeTab: 'list',
            availableTabs: [
                {
                    ...REPORT_LIST_TAB,
                },
            ],
        }
    },
    methods: {
        getRoutePath(id) {
            if (id !== 'list' && id !== 'create') {
                return `/reports/edit/${id}`
            }
            return AVAILABLE_ROUTES[id]
        },
        onChangeTab(tab) {
            console.log('onChangeTab', tab)
            console.log('this.$route.name', this.$route.name)
            if (!tab) {
                this.$router.push('/reports')
                return
            }
            this.activeTab = tab
            const tabRoute = this.getRoutePath(tab)
            console.log('tabRoute', tabRoute)
            console.log('this.$route.path', this.$route.path)
            this.$router.push(tabRoute)
        },
        onRemoveTab() {
            this.goToList()
        },
        setListTab() {
            this.activeTab = 'list'
        },
        goToList() {
            console.log('RESET STATE')
            this.setListTab()
            this.$router.push('/reports')
        },
        parseRouteData(route) {
            const {name} = route
            if (!name) {
                this.setListTab()
                return
            }
            if (name === 'reports-create') {
                this.availableTabs = [REPORT_LIST_TAB, REPORT_CREATION_TAB]
                this.activeTab = REPORT_CREATION_TAB.id
            }
        },
        onUpdateTabs(reportName, reportId) {
            this.addEditReportTab(reportName, reportId)
        },
        addEditReportTab(reportName, reportId) {
            const editTabId = `${reportId}`
            const editTab = {
                ...REPORT_EDIT_TAB,
                id: editTabId,
                title: reportName,
            }
            this.availableTabs = [REPORT_LIST_TAB, editTab]
            console.log('this.availableTabs', ...this.availableTabs)
            //this.availableTabs = [...this.availableTabs, editTab]
            this.$nextTick(() => {
                this.activeTab = editTabId
            })
        },
    },
    watch: {
        '$route': {
            immediate: true,
            deep: true,
            handler(state) {
                this.parseRouteData(state)
            },
        },
    },
}*/
</script>
