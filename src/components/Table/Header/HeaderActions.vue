<template>
    <el-dropdown class="flex header-handle" trigger="click">
        <span class="el-dropdown-link" v-on:click.stop>
            <align-justify-icon
                class="flex w-5 h-5 -mx-1">
            </align-justify-icon>
        </span>
        <el-dropdown-menu slot="dropdown" class="header-actions__container">
            <el-tabs class="mx-0" v-model="activeTab" :stretch="true">
                <el-tab-pane name="first">
                    <span slot="label"><IconGroup></IconGroup></span>
                    <columns-action
                        :currentColumn="currentColumn"
                        v-bind="$attrs"
                        v-on="$listeners">
                    </columns-action>
                </el-tab-pane>
                <el-tab-pane name="second">
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
        data() {
            return {
                activeTab: 'first'
            };
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

    .header-actions__container {
        border-radius: 4px;
        box-shadow: 0 2px 8px 0 rgba(42, 44, 54, 0.44);
        background-color: white;
        padding: 0;
        width: 201px;

        .el-tabs__item {
            height: 20px;
            color: var(--primary-color);
            padding: 0;
            display: flex;
            justify-content: center;
        }

        .el-tabs__nav-scroll {
            justify-content: center;
            display: flex;
            background: #f0f2f4;

            .el-tabs__nav {
                display: flex;
                padding: 15px 20px 12px 20px;
                justify-content: space-around;
            }
        }

        .el-tabs__header {
            margin: 0;
        }

        .el-tabs__active-bar {
            width: 100px !important;
        }

        .rtl .el-checkbox__inner {
            margin-left: 10px;
        }

        .el-popper[x-placement^=bottom] {
            margin-top: -20px;

            .popper__arrow {
                display: none;
            }
        }
    }
</style>
