<template>
    <div class="w-full flex justify-between item-center bg-transparent h-12 p-4 base-pagination">
        <el-dropdown v-if="!hidePerPageOption" trigger="click" @command="changePage">
            <div class="flex items-center">
                <div class="text-xs font-semibold text-gray-700 mr-4"> {{ $t('general.pages') }}:</div>
                <div class="text-xs font-medium text-gray">{{ value }}</div>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown" class="pages-height overflow-y-auto">
                <el-dropdown-item v-for="item in totalPages"
                                  :key="item"
                                  :command="item">
                    {{ item }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <div class="flex items-center">
            <div class="flex items-center text-base text-black mr-5 leading-5">
                <div class="flex items-center font-medium"> {{ from }} - {{ to }}</div>
                <div class="font-normal text-black mx-2 mt-0-5">{{ $t('general.of') }}</div>
                <div class="flex items-center font-medium"> {{ total }}</div>
            </div>
            <div class="w-6 md:w-12 flex items-center justify-between">
                <div
                    :class="value === 1 ? 'disabled text-gray-700':  'text-primary hover:bg-primary-50'"
                    role="button"
                    @click="prevPage()"
                    class="p-1 rounded"
                >
                    <IconSimpleArrowLeft class="w-4 h-4" />
                </div>
                <div role="button"
                    :class="value === totalPages ? 'disabled text-gray-700' : 'text-primary hover:bg-primary-50'"
                    @click="nextPage()"
                    class="p-1 rounded"
                >
                    <IconSimpleArrowRight class="w-4 h-4"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'

    export default {
        components: {
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [DropdownMenu.name]: DropdownMenu,
        },
        props: {
            pageCount: {
                type: Number,
                default: 0,
            },
            perPage: {
                type: Number,
                default: 10,
            },
            showArrows: {
                type: Boolean,
                default: true,
            },
            total: {
                type: Number,
                default: 0,
            },
            value: {
                type: Number,
                default: 1,
            },
            pagesToDisplay: {
                type: Number,
                default: 5,
            },
            hidePerPageOption: {
                type: Boolean,
                default: false,
            }
        },
        computed: {
            totalPages() {
                if (this.pageCount > 0) return this.pageCount;
                if (this.total > 0) {
                    return Math.ceil(this.total / this.perPage);
                }
                return 1;
            },
            defaultPagesToDisplay() {
                if (this.totalPages > 0 && this.totalPages < this.pagesToDisplay) {
                    return this.totalPages;
                }
                return this.pagesToDisplay;
            },
            minPage() {
                if (this.value >= this.defaultPagesToDisplay) {
                    const pagesToAdd = Math.floor(this.defaultPagesToDisplay / 2);
                    const newMaxPage = pagesToAdd + this.value;
                    if (newMaxPage > this.totalPages) {
                        return this.totalPages - this.defaultPagesToDisplay + 1;
                    }
                    return this.value - pagesToAdd;
                } else {
                    return 1;
                }
            },
            maxPage() {
                if (this.value >= this.defaultPagesToDisplay) {
                    const pagesToAdd = Math.floor(this.defaultPagesToDisplay / 2);
                    const newMaxPage = pagesToAdd + this.value;
                    if (newMaxPage < this.totalPages) {
                        return newMaxPage;
                    } else {
                        return this.totalPages;
                    }
                } else {
                    return this.defaultPagesToDisplay;
                }
            },
            from() {
                if (this.total < this.perPage) {
                    return this.value
                }
                return (this.value - 1) * this.perPage + 1
            },
            to() {
                if (this.total < this.perPage) {
                    return this.total
                }

                if (this.totalPages === this.value) {
                    return this.total
                }

                return (this.value - 1) * this.perPage + this.perPage
            },
        },
        methods: {
            range(min, max) {
                let arr = [];
                for (let i = min; i <= max; i++) {
                    arr.push(i);
                }
                return arr;
            },
            changePage(item) {
                this.$emit('input', item);
            },
            nextPage() {
                if (this.value < this.totalPages) {
                    this.$emit('input', this.value + 1);
                }
            },
            prevPage() {
                if (this.value > 1) {
                    this.$emit('input', this.value - 1);
                }
            },
            handleKeyPress(e, to) {
                const isSpaceOrEnter = e.keyCode === 32 || e.keyCode === 13;

                if (isSpaceOrEnter) {
                    e.preventDefault();
                    to()
                }
            },
        },
        watch: {
            perPage() {
                this.$emit('input', 1);
            },
            total() {
                this.$emit('input', 1);
            },
        },
    };
</script>

<style lang="scss" scoped>
ul.el-dropdown-menu {
    .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
        @apply bg-primary-50 text-primary;
    }
}

.pages-height {
    max-height: 10rem;
}

div.disabled {
    @apply cursor-not-allowed;
}
</style>
