<template>
    <div class="pagination_wrapper">
        <div class="flex w-full justify-between">
            <div>
                Pages:
                <el-dropdown class="" placement="top-end" trigger="click" @command="onPageSelect">
                        <span class="el-dropdown-link mx-2 align-bottom">
                            {{ currentPage }}
                            <i class="vc-icon-down icon-md text-primary"></i>
                        </span>
                    <el-dropdown-menu slot="dropdown" class="max-h-48 overflow-y-auto">
                        <el-dropdown-item
                            v-for="item in totalPages"
                            :key="item"
                            :command="item">
                            {{ item }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="flex">
                <span>{{ paginationFrom }} - {{ paginationTo }}</span>
                <span class="text-gray-500 mx-1">of</span>
                <span>{{ paginationTotal }}</span>
                <div class="mx-6">
                    <span @click="goToPrevPage">
                        <i class="vc-icon-left icon-lg text-primary mr-2 cursor-pointer"/>
                    </span>
                    <span @click="goToNextPage">
                        <i class="vc-icon-right icon-lg text-primary ml-2 cursor-pointer"/>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {Dropdown, DropdownMenu, DropdownItem} from 'element-ui'

export default {
    name: "table-pagination",
    components: {
        [Dropdown.name]: Dropdown,
        [DropdownMenu.name]: DropdownMenu,
        [DropdownItem.name]: DropdownItem,

    },
    props: {
        currentPage: {
            type: Number,
        },
        totalPages: {
            type: Array,
        },
        paginationFrom: {
            type: Number,
        },
        paginationTo: {
            type: Number,
        },
        paginationTotal: {
            type: Number,
        },
    },
    methods: {
        goToPrevPage() {
            this.$emit('go-to-prev-page')
        },
        goToNextPage() {
            this.$emit('go-to-next-page')
        },
        onPageSelect(page) {
            this.$emit('on-page-select', page)
        }
    }
}
</script>

<style scoped lang="scss">
.pagination_wrapper {
    @apply p-4 rounded-b-1xl;
    border: 1px solid var(--gray-300);//#EBEEF5; //var(--gray-400);
    border-top: 0;
}
</style>
