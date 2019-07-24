<template>
    <el-tabs v-model="activeTab" v-bind="$attrs" v-on="$listeners">
        <el-tab-pane v-for="(tab, index) in tabs" :label="tab.label" :name="tab.name" :key="index">
            <slot :tab="tab" :activeTab="activeTab" :index="index"></slot>
        </el-tab-pane>
    </el-tabs>
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
        },
        components: {
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane,
        },
        data() {
            return {
                timeout: null,
                activeTab: get(this.tabs, '[0].name')
            };
        },
        computed: {},
        methods: {
            changeActiveTab() {
                const index = this.tabs.findIndex(e => e.name === this.activeTab);

                if (index === -1) {
                    return;
                }

                if (index < this.tabs.length - 1) {
                    this.activeTab = this.tabs[index + 1].name;
                } else {
                    this.activeTab = get(this.tabs, '[0].name')
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
            }
        },
        beforeDestroy() {
            clearInterval(this.timeout)
        }
    }
</script>

<style lang="scss">
    .rtl .el-tabs__nav-wrap {
        display: flex;
    }

    .rtl .el-tabs__nav.is-top {
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
    }

    .el-tabs__item.is-active {
        color: var(--primary-color);
    }

    .el-tabs__active-bar {
        background-color: var(--primary-color);
    }
</style>
