<template>
    <div class="w-auto bg-white px-6 flex items-center justify-between rounded-lg shadow widget-card p-4"
         :class="{'is-vertical': isVertical}"
         :style="styles">
        <div class="w-full flex items-center justify-center"
             :class="{'flex-col': isVertical}">
            <slot name="icon">
                <component class="min-w-16 status-icon mx-1 text-primary" :is="cardIcon"/>
            </slot>
            <slot name="text">
                <el-tooltip v-if="showText" class="item" effect="dark" :content="cardText" placement="top">
                    <h5 class="text-main-xl font-bold mx-3 status-text" :style="mainColor">
                        {{cardText}}
                    </h5>
                </el-tooltip>
            </slot>
            <div :class="{[$rtl.isRTL ? 'mr-auto' : 'ml-auto']: !isVertical}">
                <slot name="value">
                    <h5 class="text-6xl font-bold -my-5"
                        :class="{'-my-6': isVertical}"
                        v-if="cardValue" :style="mainColor">
                        {{cardValue}}
                    </h5>
                </slot>
            </div>
            <div class="absolute flex action-icons" :class="{'edit-mode': editable}">
                <template v-if="editable">
                    <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                        <trash-icon class="flex align-center w-8 h-8 p-2 text-red trash-icon"
                                    @click="$emit('remove-item')"/>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                        <edit-icon class="flex align-center w-10 h-8 p-2 edit-icon text-primary"
                                   :style="mainColor"
                                   @click="showModal"/>
                    </el-tooltip>
                    <div class="flex">
                        <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"/>
                        <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"/>
                    </div>
                </template>
                <template v-else>
                    <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                        <edit-icon class="flex align-center w-10 h-8 p-2 edit-card-icon text-primary"
                                   :style="mainColor"
                                   @click="showModal"/>
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
            }
        },
        data() {
            return {
                isVertical: false,
            }
        },
        computed: {
            pageWidth() {
                return this.$store.state.utils.page.width
            },
            mainColor() {
                return get(this.styles, 'color')
            }
        },
        methods: {
            checkIfCardIsVertical() {
                this.isVertical = !!(this.$el && this.$el.clientWidth < 280);
            },
            showModal() {
                this.$emit('show-modal')
            }
        },
        mounted() {
            setTimeout(() => {
                this.checkIfCardIsVertical()
            }, 50)
        },
        watch: {
            pageWidth: {
                immediate: true,
                handler() {
                    this.checkIfCardIsVertical()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
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
<!--<base-wrapper-->
<!--    v-bind="$attrs"-->
<!--    v-on="$listeners"-->
<!--    :cardValue="cardValue"-->
<!--    :showText="showStatusText"-->
<!--    :cardIcon="cardIcon"-->
<!--    :cardText="cardText"-->
<!--    :styles="cardStyles"-->
<!--    @show-modal="onShowModal"-->
<!--/>-->
