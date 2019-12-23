<template>
    <div class="tabs-container">
        <el-tabs v-model="activeTab" v-bind="$attrs" class="widget--group_section">
            <el-tab-pane v-for="(tab, index) in tabs" :label="tab.WidgetGroupTitle" :name="tab.WidgetGroupID.toString()"
                         :key="index">
                <slot :tab="tab" :activeTab="activeTab" :index="index"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Tabs, TabPane} from 'element-ui'

    export default {
        inheritAttrs: false,
        props: {
            circularTimeout: Number,
            tabs: {
                type: Array,
                default: () => []
            },
            newActiveTab: [String, Number]
        },
        components: {
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane,
        },
        data() {
            return {
                timeout: null,
                activeTab: get(this.tabs, '[0].WidgetGroupID').toString()
            };
        },
        methods: {
            changeActiveTab() {
                const index = this.tabs.findIndex(e => e.WidgetGroupID.toString() === this.activeTab);

                if (index === -1) {
                    return;
                }

                if (index < this.tabs.length - 1) {
                    this.activeTab = (this.tabs[index + 1].WidgetGroupID).toString();
                } else {
                    this.activeTab = get(this.tabs, '[0].WidgetGroupID').toString()
                }
            },
            triggerCircularTimeout() {
                clearInterval(this.timeout)
                if (this.circularTimeout) {
                    this.timeout = setInterval(this.changeActiveTab, this.circularTimeout * 1000);
                }
            },
        },
        watch: {
            circularTimeout: {
                immediate: true,
                handler: function () {
                    this.triggerCircularTimeout()
                }
            },
            newActiveTab(val) {
                this.activeTab = val.toString()
            },
            activeTab(val) {
                this.$emit('switch-tab', val)
            }
        },
        beforeDestroy() {
            clearInterval(this.timeout)
        }
    }
</script>
<style lang="scss">
    .tabs-container {
        .el-tabs__header {
            display: none;
        }

        .el-tabs__content {
            .display-widget__tabs {
                .el-tabs__header {
                    display: block !important;
                    @apply m-0;
                }
            }
        }

        .el-tabs__nav-scroll {
            @apply px-2;
        }

        .el-tabs__nav-wrap::after {
            background-color: transparent;
        }

        .el-tabs__active-bar {
            height: 2px;
            border-radius: 4.5px;
        }

        .el-tabs__item {
            height: 48px;
            padding: 5px 20px;
            color: var(--steel);
            cursor: pointer;
            font-size: 14px;
        }

        .el-tabs__nav-next, .el-tabs__nav-prev {
            line-height: 50px;
            font-size: 20px;
        }
    }
</style>
