<template>
    <el-dropdown class="flex ml-auto header-handle" trigger="click">
        <span class="el-dropdown-link" v-on:click.stop>
            <align-justify-icon
                    class="flex w-5 h-5 -mx-1">
            </align-justify-icon>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-tabs class="mx-0">
                <el-tab-pane>
                    <span slot="label"><IconGroup></IconGroup></span>
                    <columns-action
                            :currentColumn="currentColumn"
                            v-bind="$attrs"
                            v-on="$listeners">
                    </columns-action>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"><IconEqualizerFill></IconEqualizerFill></span>TBD
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"><IconGridLine></IconGridLine></span>
                    <columns-visibility
                            :availableColumns="availableColumns"
                            :visibleColumns="visibleColumns"
                            v-bind="$attrs"
                            v-on="$listeners">
                    </columns-visibility>
                </el-tab-pane>
            </el-tabs>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>

    import ColumnsAction from './ColumnsAction';
    import {AlignJustifyIcon} from 'vue-feather-icons'
    import ColumnsVisibility from './ColumnsVisibility';
    import {Dropdown, DropdownItem, DropdownMenu, Tabs, TabPane} from 'element-ui'

    export default {
        name: 'header-actions',
        components: {
            ColumnsAction,
            ColumnsVisibility,
            AlignJustifyIcon,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [DropdownMenu.name]: DropdownMenu,
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane,
        },
        props: {
            availableColumns: {
                type: Array,
                default: () => []
            },
            visibleColumns: {
                type: Array,
                default: () => []
            },
            currentColumn: {
                type: Object,
                default: () => ({})
            },
        },
    }

</script>

<style lang="scss">
    .rtl .header-handle {
        margin-right: auto;
        margin-left: 0;
    }

    .el-tabs__item {
        height: 20px;
        color: var(--primary-color);
    }

    .el-tabs__nav-scroll {
        margin: 0 2rem;
    }

    .rtl .el-tabs__nav.is-top {
        display: flex;
        padding-bottom: 5px;
        flex-direction: row-reverse;
    }

    .el-tabs__active-bar {
        background-color: var(--primary-color);
    }

    .rtl .el-checkbox__inner {
        margin-left: 10px;
    }
</style>
