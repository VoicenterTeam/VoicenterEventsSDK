<template>
    <div class="mx-0-5" v-if="item.layout">
        <div class="w-full bg-white p-5 mt-1 flex items-center justify-between rounded-lg shadow"
             :style="getWrapperStyles">
            <div class="w-full flex flex-row items-center justify-between" :style="getLayoutStyles">
                <slot name="label">
                    <h5 class="text-main-base font-bold mx-1" v-if="item.layout.showText">
                        {{item.label}}
                    </h5>
                </slot>
                <slot name="value">
                    <h2 class="text-main-xl font-bold mx-1">
                        {{item.value}}
                    </h2>
                </slot>
            </div>
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.styles')" placement="top">
                <edit-icon
                    class="align-center w-10 h-8 p-2 edit-card-icon text-primary"
                    @click="()=>{this.showModal = true}"/>
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
    import {Checkbox, Tooltip} from 'element-ui'
    import {EditIcon} from 'vue-feather-icons'
    import UpdateDialog from '@/components/Cards/UpdateDialog'

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
            getWrapperStyles() {
                let item = this.item

                let styles = {
                    'color': item.colors.fonts,
                    'background': item.colors.background,
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
            getLayoutStyles() {
                let item = this.item
                let styles = {
                    'min-width': `${item.layout.minWidth}px`,
                    'max-width': `${item.layout.maxWidth}px`,
                };
                return styles
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
        top: -20px;
        right: -25px;
    }

    .rtl .edit-card-icon {
        left: -25px;
        right: auto;
    }
</style>
