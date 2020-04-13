<template>
    <div :class="{'is-vertical': isVertical}"
         :style="styles"
         class="w-auto bg-white px-6 flex items-center justify-between rounded-lg shadow widget-card p-4">
        <div :class="{'flex-col': isVertical}"
             class="w-full flex items-center justify-center">
            <slot name="icon">
                <component :is="cardIcon" class="min-w-16 status-icon mx-1 text-primary"/>
            </slot>
            <slot name="text">
                <el-tooltip :content="cardText" class="item" effect="dark" placement="top" v-if="showText">
                    <h5 :style="mainColor" class="text-main-xl font-bold mx-3 status-text">
                        {{cardText}}
                    </h5>
                </el-tooltip>
            </slot>
            <div :class="{[$rtl.isRTL ? 'mr-auto' : 'ml-auto']: !isVertical}">
                <slot name="value">
                    <h5 :class="{'-my-6': isVertical}"
                        :style="mainColor"
                        class="text-6xl font-bold -my-5">
                        {{cardValue}}
                    </h5>
                </slot>
            </div>
            <div :class="{'edit-mode': editable}" class="absolute flex action-icons">
                <template v-if="editable">
                    <el-tooltip :content="$t('tooltip.remove.widget')" class="item" effect="dark" placement="top">
                        <trash-icon @click="$emit('remove-item')"
                                    class="flex align-center w-8 h-8 p-2 text-red trash-icon"/>
                    </el-tooltip>
                    <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                        <edit-icon :style="mainColor"
                                   @click="showModal"
                                   class="flex align-center w-10 h-8 p-2 edit-icon text-primary"/>
                    </el-tooltip>
                    <div class="flex">
                        <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"/>
                        <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"/>
                    </div>
                </template>
                <template v-else>
                    <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                        <edit-icon :style="mainColor"
                                   @click="showModal"
                                   class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"/>
                    </el-tooltip>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {EditIcon, MoreVerticalIcon, TrashIcon} from 'vue-feather-icons'
    import {Tooltip} from "element-ui";

    export default {
        components: {
            TrashIcon,
            EditIcon,
            MoreVerticalIcon,
            [Tooltip.name]: Tooltip,
        },
        props: {
            editable: {
                type: Boolean,
                default: false,
            },
            showText: {
                type: Boolean,
                default: false,
            },
            cardIcon: {
                type: String,
                default: '',
            },
            cardText: {
                type: String,
                default: '',
            },
            cardValue: {
                type: [String, Number],
                default: '',
            },
            styles: {
                type: Object,
                default: () => ({}),
            },
            layoutWidth: {
                type: Object,
                default: () => ({}),
            },
        },
        data () {
            return {
                isVertical: false,
            }
        },
        computed: {
            pageWidth () {
                return this.$store.state.utils.page.width
            },
            mainColor () {
                return get(this.styles, 'color')
            }
        },
        methods: {
            checkIfCardIsVertical () {
                this.isVertical = this.layoutWidth.minWidth < 280;
            },
            showModal () {
                this.$emit('show-modal')
            }
        },
        mounted () {
            setTimeout(() => {
                this.checkIfCardIsVertical()
            }, 50)
        },
        watch: {
            pageWidth: {
                immediate: true,
                handler () {
                    this.checkIfCardIsVertical()
                }
            },
            'layoutWidth.minWidth' () {
                this.$nextTick(this.checkIfCardIsVertical)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .status-icon {
        max-width: 64px;
    }

    .action-icons {
        top: 40px;
        right: 20px;

        &.edit-mode {
            top: 0;
        }
    }
</style>
