<template>
    <el-dialog class="confirm-dialog" v-bind="$attrs" v-on="$listeners" :append-to-body="appendToBody">
        <slot name="title"></slot>
        <div class="w-full flex py-2">
            <slot name="content"></slot>
        </div>
        <template slot="footer">
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog} from 'element-ui'

    export default {
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog
        },
        data() {
            return {
                appendToBody: true
            }
        }
    }
</script>
<style scoped lang="scss">
    .confirm-dialog /deep/ {
        .el-dialog {
            border-radius: 8px;
        }

        .el-dialog__footer {
            background-color: var(--pale-grey);
            padding: 15px 25px;
            border-radius: 0 0 8px 8px;
        }

        .el-button--default {
            background: transparent;
            border: none;
        }
    }
</style>
