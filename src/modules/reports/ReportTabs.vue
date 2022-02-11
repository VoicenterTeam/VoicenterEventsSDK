<template>
    <div class="my-10 mx-10 xl:mx-20">
        <el-tabs v-model="activeTabName"
                 square
                 @tab-remove="removeTab"
                 closable>
            <el-tab-pane
                v-for="item in dataTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                :closable="item.name !== createTabName && item.name !== listTabName">
                <template>
                    <slot :name="item.name"
                          :label="item.title"
                          :data="item.data"
                          :add-tab="addTab">
                        {{ item.content }}
                    </slot>
                </template>
                <span slot="label">
                    <i :class="item.icon" class="icon-md"/> {{ item.title }}
                </span>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {TabPane, Tabs} from 'element-ui'

const CREATE_TAB_NAME = 'create';
const LIST_TAB_NAME = 'list'

export default {
    name: "report-tabs",
    components: {
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
    },
    props: {
        dataTabs: {
            type: Array,
            default: []
        },
        activeTab: {
            type: String,
            default: LIST_TAB_NAME
        }
    },
    data() {
        return {
            createTabName: CREATE_TAB_NAME,
            listTabName: LIST_TAB_NAME,
            activeTabName: this.activeTab || LIST_TAB_NAME
        }
    },
    watch: {
        activeTabName(val) {
            /*let routePath
            if (val === this.listTabName) {
                routePath = '/reports'
            } else if (val === this.createTabName) {
                routePath = '/reports/create'
            } else {
                routePath = `/reports/edit/${val}`
            }
            if (this.$route.path === routePath) return*/

            this.$emit('update-active-tab', val)
            //this.$router.push(routePath)
        },
        activeTab: {
            immediate: true,
            handler(val) {
                this.activeTabName = val
            }
        }
    },
    methods: {
        addTab() {

        },
        removeTab(tab) {
            console.log('tab', tab)
            this.$emit('on-remove-tab', tab)
        }
    }
}
</script>
