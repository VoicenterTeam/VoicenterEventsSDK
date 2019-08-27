<template>
    <div class="tabs-container">
        <el-tabs v-model="activeTab" v-bind="$attrs">
            <el-tab-pane v-for="(tab, index) in tabs" :label="tab.WidgetGroupTitle" :name="tab.WidgetGroupID.toString()"
                         :key="index">
                <slot :tab="tab" :activeTab="activeTab" :index="index"></slot>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>

    import {Tabs, TabPane} from 'element-ui'
    import get from 'lodash/get';

    export default {
        inheritAttrs: false,
        props: {
            circularTimeout: Number,
            tabs: {
                type: Array,
                default: () => []
            },
            newActiveTab: String
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
    .rtl .tabs-container .el-tabs__nav-wrap {
        display: flex;
    }

    .tabs-container {
        .el-tabs__header {
            box-shadow: 0 0 1px 0 var(--silver-two), 0 1px 4px 0 var(--silver-two);
            background-color: white;
            border-radius: 2px;
            display: none;
        }

        .el-tabs__nav-scroll {
            padding: 0 56px;
        }

        .el-tabs__nav-wrap::after {
            background-color: transparent;
        }

        .el-tabs__active-bar {
            height: 4px;
            border-radius: 4.5px;
        }

        .el-tabs__item {
            height: 58px;
            padding: 10px 20px;
            color: var(--steel);
            cursor: pointer;
            font-size: 18px;
            @apply font-medium;
        }

    }
</style>
