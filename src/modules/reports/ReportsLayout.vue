<template>
    <div>
        <BaseNavbar/>
        <report-tabs :dataTabs="dataTabs" :active-tab="activeTab" @update-active-tab="updateActiveTab">
            <template v-slot:list>
                <list-temp/>
            </template>

            <template v-for="tab in editableTabs"
                      v-slot:[tab.name]="{data}">
                <edit-temp :data="data"/>
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
                {
                    title: 'momo',
                    name: '10',
                    icon: 'vc-icon-template-list',
                },
                {
                    title: 'lolo',
                    name: '49',
                    icon: 'vc-icon-template-list',
                },
                {
                    title: 'Create',
                    name: CREATE_TAB_NAME,
                    icon: 'vc-icon-template-list',
                }
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
            this.activeTab = tab
        }
    },
    watch: {
        '$route': {
            immediate: true,
            handler(route) {
                console.log('route.path', route.path)
                const baseRoute = '/reports'
                console.log('route.params.id', route.params.id)
                if (route.path === baseRoute + '/edit/' + route.params.id) {
                    this.activeTab = route.params.id
                }
            }
        }
    }
}
</script>
