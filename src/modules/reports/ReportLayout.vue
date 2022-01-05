<template>
    <div>
        <BaseNavbar/>
        <div class="my-10 mx-10 xl:mx-20">
            <editable-tabs ref="tab"
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
            </fade-transition>
        </div>
    </div>
</template>
<script>
    import BaseNavbar from '@/components/Navbar/BaseNavbar'
    import EditableTabs from '@/modules/common/components/EditableTabs'

    const REPORT_CREATION_TAB = {
        title: 'New Report',
        name: 'reports-create',
        icon: 'IconStore',
    }

    const REPORT_EDIT_TAB = {
        name: 'reports-edit',
        icon: 'IconEdit',
    }

    const REPORT_LIST_TAB = {
        title: 'Report List',
        name: 'list',
        icon: 'IconList',
    }

    const AVAILABLE_ROUTES = {
        'list': '/reports',
        'reports-create': '/reports/create',
    }

    export default {
        components: {
            BaseNavbar,
            EditableTabs,
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
            onChangeTab(tab) {
                const { name } = tab || ''
                if (!name) {
                    this.$router.push('/reports')
                    return
                }
                this.activeTab = name
                const tabRoute = AVAILABLE_ROUTES[name]
                this.$router.push(tabRoute)
            },
            onRemoveTab() {
                this.goToList()
            },
            setListTab() {
                this.availableTabs = [REPORT_LIST_TAB]
                this.activeTab = 'list'
            },
            goToList() {
                this.setListTab()
                this.$router.push('/reports')
            },
            parseRouteData(route) {
                const { name } = route
                if (!name || name === 'reports-list') {
                    this.setListTab()
                    return
                }
                if (name === 'reports-create') {
                    this.availableTabs = [REPORT_LIST_TAB, REPORT_CREATION_TAB]
                    this.activeTab = REPORT_CREATION_TAB.name
                }
            },
            onUpdateTabs(reportName) {
                this.addEditReportTab(reportName)
            },
            addEditReportTab(reportName) {
                const editTab = {
                    ...REPORT_EDIT_TAB,
                    title: reportName,
                }
                this.availableTabs = [REPORT_LIST_TAB, editTab]
                this.$nextTick(() => {
                    this.activeTab = 'reports-edit'
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
    }
</script>
