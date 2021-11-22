<template>
    <div class="d-list-wrapper" ref="dListWrapper">
        <div class="inline-flex items-center" ref="dList">
            <span v-for="(item, index) in shortList" :key="index" class="flex items-center">
                <slot name="list-item" :item="item" :index="index">
                    {{ item.value }}
                </slot>
                <span v-if="showSeparator(index)"
                      class="block">
                    <slot name="separator">{{ separator }}</slot>
                </span>
            </span>
            <template v-if="otherList.length">
                <component :is="showTooltip ? 'el-popover' : 'div'"
                           :class="{'list-popover': showTooltip}"
                           trigger="hover"
                           placement="top"
                           effect="light"
                           v-bind="$attrs">
                    <slot name="other-content" :list="otherList"/>
                    <span slot="reference">
                        <slot name="other-icon" :data="otherList.length">
                            ({{ otherList.length }})
                        </slot>
                    </span>
                </component>
            </template>
        </div>
    </div>
</template>
<script>
    import { Popover } from 'element-ui'
    import { getRefElement } from '@/util/vueHelpers'
    
    export default {
        components: {
            [Popover.name]: Popover,
        },
        props: {
            list: {
                type: Array,
                default: () => [],
            },
            limit: {
                type: Number,
                default: 3,
            },
            separator: {
                type: String,
                default: ',',
            },
            showTooltip: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                localLimit: 1,
                oldLocalLimit: 1,
                minLimit: 1,
            }
        },
        watch: {
            windowWidth() {
                this.updateList()
            },
            limit() {
                this.updateList()
            },
            'list.length'() {
                this.updateList()
            },
        },
        computed: {
            shortList() {
                return this.list.slice(0, this.localLimit)
            },
            otherList() {
                return this.list.length > this.localLimit ? this.list.slice(this.localLimit) : []
            },
        },
        methods: {
            showSeparator(index) {
                return (index < this.shortList.length - 1 && !this.otherList.length) ||
                    (index < this.shortList.length && this.otherList.length)
            },
            initLimit() {
                this.localLimit = 1
            },
            async isListSmaller({ listWidth, listWrapperWidth, list, listWrapper }) {
                while (listWidth < listWrapperWidth) {
                    if (this.localLimit > this.limit) {
                        this.localLimit = this.limit
                        break;
                    }
                    this.localLimit++
                    await this.$nextTick()
                    listWidth = list.clientWidth
                    listWrapperWidth = listWrapper.clientWidth
                    
                    if (listWidth > listWrapperWidth) {
                        if (this.localLimit > this.minLimit && this.localLimit <= this.limit) {
                            this.localLimit--
                        } else if (this.localLimit > this.limit) {
                            this.localLimit = this.limit
                        } else if (this.localLimit < this.minLimit) {
                            this.localLimit = this.minLimit
                        }
                        break;
                    }
                }
            },
            async isListBigger({ listWidth, listWrapperWidth, list, listWrapper }) {
                while (listWidth > listWrapperWidth) {
                    if (this.localLimit < this.minLimit) {
                        this.localLimit = this.minLimit
                        break;
                    }
                    this.localLimit--
                    await this.$nextTick()
                    listWidth = list.clientWidth
                    listWrapperWidth = listWrapper.clientWidth
                    
                    if (listWidth < listWrapperWidth) {
                        if (this.localLimit > this.limit) {
                            this.localLimit = this.limit
                        } else if (this.localLimit < this.minLimit) {
                            this.localLimit = this.minLimit
                        }
                        break;
                    }
                }
            },
            async updateLocalLimit({ list, listWrapper }) {
                let listWidth = list.clientWidth
                let listWrapperWidth = listWrapper.clientWidth
                
                if (listWidth < listWrapperWidth) {
                    await this.isListSmaller({ listWidth, listWrapperWidth, list, listWrapper })
                } else if (listWidth > listWrapperWidth) {
                    await this.isListBigger({ listWidth, listWrapperWidth, list, listWrapper })
                }
                this.oldLocalLimit = this.localLimit
            },
            async updateList() {
                this.initLimit()
                const listRef = this.$refs['dList']
                const listWrapperRef = this.$refs['dListWrapper']
                
                if (listRef && listWrapperRef) {
                    const list = getRefElement(listRef)
                    const listWrapper = getRefElement(listWrapperRef)
                    await this.updateLocalLimit({ list, listWrapper })
                }
            },
        },
        created() {
            this.updateList()
        },
        mounted() {
            this.updateList()
        },
    }
</script>

<style scoped lang="scss">
.d-list-wrapper {
    @apply w-full;
}

.list-popover {
    display: flex;
    
    & > .el-popover__reference {
        display: flex;
    }
}
</style>
