<template>
    <div class="flex flex flex-col columns-props">
        <div class="border-b-2 flex cursor-pointer" @click="pinColumn">
            <p class="mx-8 mb-2 -mt-1 text-sm text-gray">
                {{$t('datatable.props.pin_column')}}
            </p>
        </div>
        <div class="border-b-2 flex cursor-pointer" @click="autoSizeColumns">
            <p class="mx-8 my-2 text-sm text-gray">
                {{$t('datatable.props.autosize_columns')}}
            </p>
        </div>
        <div class="flex cursor-pointer" @click="resetChanges">
            <p class="mx-8 mt-2 text-sm text-gray">
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
    .text-gray {
        color: #4a4a4a;
    }
</style>
