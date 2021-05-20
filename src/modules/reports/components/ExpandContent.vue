<template>
    <div class="expanded w-full flex-1">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, totam!
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
        },
    }
</script>
<style lang="scss">
.el-table__expanded-cell {
    border-left: 2px solid var(--primary-color);
}
.rtl {
    .el-table__expanded-cell {
        @apply border-l-0;
        border-right: 2px solid var(--primary-color);
    }
}
</style>
