<template>
    <div class="w-full flex items-center sidebar-tabs__container">
        <div class="tab-name px-16 text-main-lg cursor-pointer" v-for="group in widgetGroupList">
            <p @click="switchTab(group.WidgetGroupID.toString())"
               class="whitespace-no-wrap"
               :class="{'active': group.WidgetGroupID.toString() === activeTab.toString()}">
                {{group.WidgetGroupTitle}}
            </p>
            <div v-if="group.WidgetGroupID.toString() === activeTab.toString()"
                 class="self-border mt-4">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            widgetGroupList: {
                type: Array,
                default: () => ([])
            },
            activeTab: {
                type: [String, Number],
                default: ''
            }
        },
        methods: {
            switchTab(val) {
                this.$emit('switch-tab', val)
            }
        },
    }
</script>
<style scoped lang="scss">
    .sidebar-tabs__container {
        position: absolute;
        box-shadow: 0 0 1px 0 var(--silver-two), 0 1px 4px 0 var(--silver-two);
        background-color: #ffffff;
        height: 58px;
        margin-top: 90px;
        overflow-x: auto;
        min-width: 320px;
        width: 100vw;
        @apply -ml-12;
        @screen md {
            @apply -ml-12;
        }
    }

    .tab-name {
        height: 22px;
        line-height: normal;
        color: var(--steel);

        :hover, .active {
            color: var(--greyish-brown);
        }

        &:first-child {
            margin-left: 65px;
        }
    }

    .self-border {
        height: 2px;
        border-radius: 4.5px;
        background-color: var(--primary-color);
        width: 144%;
        margin-left: -22%;
    }

    .rtl {
        .self-border {
            margin-right: -22%;
        }

        .sidebar-tabs__container {
            @apply -mr-12;
        }
    }
</style>
