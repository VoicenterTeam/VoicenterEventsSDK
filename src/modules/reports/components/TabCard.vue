<template>
    <div :class="{'tabs-bg-white': whiteBg}">
        <el-tabs
            v-model="activeTabName"
            type="card"
            class="card-tab"
            :data-test="`${dataTestName}-tab-card`"
            v-on="$listeners"
            @tab-remove="removeTab"
        >
            <el-tab-pane
                :lazy="lazy"
                class="editable-tab"
                v-for="item in dataTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                :disabled="item.disabled"
            >
                <span
                    slot="label"
                    class="flex items-center"
                    :data-test="`${item.name}-tab`"
                    :class="{
                        'opacity-40': item.disabled
                    }"    
                >
                  <slot name="label" :item="item">
                      <slot name="label-icon" :item="item" v-if="!item.hideIcon">
                        <i :class="item.icon || defaultIcon" class="text-active-elements icon-lg"></i>
                      </slot>
                      <slot name="label-content" :item="item">
                        <div class="mx-3 tab-name text-default-text text-base font-medium">{{item.title}}</div>
                      </slot>
                  </slot>
                </span>
                <template>
                    <div class="mb-2 tab-card-slot">
                        <slot
                            :name="item.name"
                            :label="item.title"
                            :data="item.data"
                            :add-tab="addTab"
                        >
                            {{ item.content }}
                        </slot>
                    </div>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {TabPane, Tabs} from 'element-ui'

    export default {
        name: "tab-card",
        components: {
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane
        },
        props: {
            data: {
                type: Array,
                default: () => []
            },
            lazy:{
                type: Boolean,
                default: true
            },
            labelTable: {
                type: String
            },
            activeTab: {
                type: String
            },
            whiteBg: {
                type: Boolean,
                default: true
            },
            staticTabs:{
                type: Boolean,
                default: false,
                description: 'the url path will not affect the active tab name properti'
            },
            dataTestName: {
                type: String
            }
        },
        data() {
            return {
                activeTabName: this.activeTab,
                defaultIcon: 'vc-icon-type'
            }
        },
        computed: {
            dataTabs() {
                return this.data;
            }
        },
        watch: {
            activeTab(newTab) {

                if (newTab !== this.activeTabName) {
                    this.activeTabName = newTab
                }

                if(this.staticTabs){
                    return
                }
            },
            activeTabName(newVal) {
                this.$emit('update:activeTab', newVal)
            }
        },
        methods: {
            addTab(row, name, title) {
                const tab = this.dataTabs.find(element => {
                    return element.name === row[name].toString();
                });

                if (tab) {
                    this.activeTabName = tab.name
                } else {
                    this.dataTabs.splice(this.dataTabs.length - 1, 0, {
                        title: row[title],
                        name: row[name].toString(),
                        data: row
                    });

                    this.activeTabName = row[name].toString()
                }
            },

            removeTab(targetName) {
                const tabs = this.dataTabs;
                let activeName = this.activeTabName;

                if (targetName === "list" || targetName === "create") {
                    return;
                }

                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            const prevTab = tabs[index - 1] || tabs[index + 1];

                            if (prevTab) activeName = prevTab.name;
                        }
                    });
                }

                this.activeTabName = activeName;
                this.$emit('remove-tab', targetName);
            }
        }
    }
</script>

<style lang="scss" scoped>
    ::v-deep {
        .card-tab {
            & > .el-tabs__header.is-top {
                margin-bottom: 0 !important;
            }

            & > .el-tabs__header .el-tabs__nav {
                border: unset;
                display: flex;

                &.el-tabs__nav {
                    border: unset;
                }
            }

            & > .el-tabs__header {
                border-bottom: unset;
            }

            & > .el-tabs__header > .el-tabs__nav-wrap > .el-tabs__nav-scroll > .el-tabs__nav > .el-tabs__item {
                border-left: unset;
                margin-left: 1.5px;
                margin-right: 20px;
                border-bottom: unset;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                margin-top: 5px;
                height: 50px;
                line-height: 50px;
                display: flex;
                flex-direction: row;

                @apply text-base text-default-text bg-gray-100;

                box-shadow: 0 0 5px var(--gray-400);

                &.is-active {
                    @apply bg-white;
                }
            }
            & > .el-tabs__item {
                @apply flex items-center justify-center;
            }

            & > .el-tabs__content {
                background: #FFFFFF;
                box-shadow: 0px 1px 6px #E0E2E5;
                border-radius: 0 6px 6px 6px;
                overflow: visible;
                margin: 0 1.5px;
            }
        }
    }
::v-deep .schedule-list-container {
    @apply mt-0 p-8;
}
.tab-card-slot {
    height: 650px;
}
</style>
