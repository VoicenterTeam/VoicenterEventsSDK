<template>
    <div class="py-2 bg-white flex widget-card items-center justify-between">
        <div class="flex items-center">
            <slot name="icon">
                <component class="w-7 mx-1 text-primary" :is="icon"></component>
            </slot>
            <slot name="title">
                <p class="text-sm mx-2 caption" @click="$emit('add-widget')">
                    {{name}}
                </p>
            </slot>
        </div>
        <div class="justify-end quantity">
            <slot name="quantity"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            icon: String,
            name: {
                type: [String, Number],
                default: '- -'
            }
        }
    }
</script>
<style lang="scss" scoped>
    .caption {
        color: var(--dark);
    }

    .widget-card {
        border-bottom: solid 1px var(--silver-color);
    }

    .quantity /deep/ {
        .el-icon-arrow-down:before {
            content: "\e6d8";
        }

        .el-icon-arrow-up:before {
            content: "\e6d9";
        }

        .el-input-number.is-controls-right .el-input__inner {
            padding-right: 40px;
        }

        .el-input-number--mini {
            @apply w-16;
            .el-input-number__decrease, .el-input-number__increase {
                width: 30px;
                background: white;
            }
        }
    }

    .w-7 {
        width: 1.6rem;
    }
</style>
