<template>
    <div class="mx-1 py-1" v-if="item.layout">
        <div class="bg-white px-4 py-4 flex items-center justify-between rounded-lg shadow"
             :style="getCardStyles">
            <div class="flex flex-col w-full items-center justify-between">
                <slot name="label">
                    <div class="flex">
                        <h5 class="text-2xl font-bold mx-1" v-if="item.layout.showText">
                            {{$t(item.label) || item.label}}
                        </h5>
                    </div>
                </slot>
                <slot name="value">
                    <div class="flex items-center">
                        <span class="text-xl px-1" v-if="item.showAbsoluteNumbers">({{item.count}})</span>
                        <h2 class="text-4xl font-bold -my-2">
                            {{formatItemValue}}
                        </h2>
                    </div>
                </slot>
            </div>
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.styles')" placement="top">
                <edit-icon
                    class="align-center w-10 h-8 p-2 edit-card-icon text-primary"
                    :style="{ color: getCardStyles.color }"
                    @click="showModal = true"/>
            </el-tooltip>
        </div>
        <update-dialog
            v-if="showModal"
            :visible.sync="showModal"
            :onlyBackground="false"
            :model="item"
            @on-change="onChange">
            <template v-slot:content>
                <el-checkbox v-model="item.layout.showText" class="-mt-4">
                    {{$t('status.show.text')}}
                </el-checkbox>
                <el-checkbox v-model="item.layout.showBorder" class="pt-4">
                    {{$t('status.display.border')}}
                </el-checkbox>
            </template>
            <template v-slot:width>
                <label class="pt-3 pb-2">{{$t('Card max width')}}</label>
                <el-input type="number" v-model="item.layout.maxWidth"/>
                <label class="pt-3 pb-2">{{$t('Card min width')}}</label>
                <el-input type="number" v-model="item.layout.minWidth"/>
            </template>
            <template v-slot:footer>
                <el-button @click="showModal = false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
            </template>
        </update-dialog>
    </div>
</template>
<script>
    import {EditIcon} from 'vue-feather-icons'
    import {Checkbox, Tooltip} from 'element-ui'
    import {timeFormatter} from "@/helpers/timeFormatter";
    import UpdateDialog from '@/components/Cards/UpdateDialog'
    import {MAX_RING_TIME_KEY, AVG_RING_TIME_KEY} from "@/enum/queueDashboardStatistics";

    export default {
        components: {
            [Checkbox.name]: Checkbox,
            [Tooltip.name]: Tooltip,
            UpdateDialog,
            EditIcon,
        },
        props: {
            item: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            getCardStyles() {
                let item = this.item

                let styles = {
                    'color': item.colors.fonts,
                    'background': item.colors.background,
                    'min-width': `${item.layout.minWidth}px`,
                    'max-width': `${item.layout.maxWidth}px`,
                }

                if (item.layout.showBorder) {
                    styles = {
                        ...styles,
                        ...{
                            'border': `2px solid ${item.colors.frames}`,
                        }
                    }
                }
                return styles
            },
            formatItemValue() {
                if ([MAX_RING_TIME_KEY, AVG_RING_TIME_KEY].includes(this.item.key)) {
                    return timeFormatter(this.item.value)
                }
                return this.item.value
            }
        },
        methods: {
            onChange() {
                let objToEmit = {
                    layout: this.item.layout,
                    colors: this.item.colors
                }
                this.$emit('on-change', objToEmit)
                this.showModal = false;
            },
        },
        data() {
            return {
                showModal: false,
            }
        },
    }
</script>
<style lang="scss" scoped>
    .edit-card-icon {
        @apply relative cursor-pointer;
        top: -40px;
        right: -20px;
    }

    .rtl .edit-card-icon {
        left: -20px;
        right: auto;
    }
</style>
