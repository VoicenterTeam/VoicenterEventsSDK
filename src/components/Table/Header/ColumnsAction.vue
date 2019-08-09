<template>
    <div class="flex flex-col column_actions--container">
        <div class="with-border__b" @click="pinColumn">
            <p class="column_actions--name">
                {{$t('datatable.props.pin_column')}}
            </p>
        </div>
        <div class="with-border__b" @click="autoSizeColumns">
            <p class="column_actions--name">
                {{$t('datatable.props.autosize_columns')}}
            </p>
        </div>
        <div @click="resetChanges">
            <p class="column_actions--name">
                {{$t('datatable.props.reset_columns')}}
            </p>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'columns-action',
        components: {},

        data() {
            return {
                column: this.currentColumn,
                fitWidth: false
            }
        },
        props: {
            currentColumn: {
                type: Object,
                default: () => ({})
            },
        },
        methods: {
            pinColumn() {
                this.column.fixed = true
                this.$emit('on-pin-column', this.column)
            },
            autoSizeColumns() {
                this.$emit('on-change-columns-size', true)
            },
            resetChanges() {
                this.$emit('on-reset-props')
            }
        }
    }

</script>

<style lang="scss" scoped>
    .column_actions--container {
        color: var(--greyish-brown);
        @apply text-sm;
        > div {
            &.with-border__b {
                border-bottom: solid 1px var(--silver-color);
            }
            @apply flex;
            @apply cursor-pointer;
        }
    }

    .column_actions--name {
        @apply ml-8;
        @apply mr-2;
        @apply my-3;
    }

    .column_actions--container > div:hover {
        @apply text-blue-600;
        @apply bg-blue-100;
    }

    .rtl .column_actions--name {
        @apply mr-8;
        @apply ml-2;
    }
</style>
