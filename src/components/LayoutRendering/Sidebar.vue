<template>
    <div class="w-full flex items-center sidebar-tabs__container">
        <div class="tab-name padding-x_56  text-lg cursor-pointer" v-for="group in widgetGroupList">
            <p @click="switchTab(group.WidgetGroupID.toString())"
               class="whitespace-no-wrap"
               :class="{'active': group.WidgetGroupID.toString() === activeTab}">
                {{group.WidgetGroupTitle}}
            </p>
            <div v-if="group.WidgetGroupID.toString() === activeTab"
                 class="self-border mt-3">
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
            activeTab: String
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
        margin-right: -1.5rem;
        margin-left: -1.5rem;
        box-shadow: 0 0 1px 0 var(--silver-two), 0 1px 4px 0 var(--silver-two);
        background-color: #ffffff;
        height: 58px;
        margin-top: 90px;
        overflow-x: auto;
        min-width: 320px;
    }

    @media (min-width: 768px) {
        .sidebar-tabs__container {
            margin-right: -6rem;
            margin-left: -6rem;
        }
    }
    .tab-name {
        height: 22px;
        line-height: normal;
        color: var(--steel);

        :hover, .active {
            color: var(--greyish-brown);
            @apply font-medium;
        }
    }

    .self-border {
        height: 6px;
        border-radius: 4.5px;
        background-color: var(--primary-color);
        width: 144%;
        margin-left: -22%;
    }

    .rtl .self-border {
        margin-right: -22%;
    }

    .padding-x_56 {
        padding: 0 3.5rem;
    }

    /*3.5rem*/

</style>
