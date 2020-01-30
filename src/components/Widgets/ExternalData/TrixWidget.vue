<template>
    <div class="trix-widget">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full py-1">
            <div class="flex">
                <p v-if="data.Title" class="text-main-2xl font-semibold">
                    {{getInfo}}
                </p>
            </div>
            <div class="flex items-center" :class="margins" v-if="!editable">
                <el-tooltip class="item" effect="dark" :content="$t('Set edit mode')" placement="top">
                    <el-switch
                        v-model="editMode"/>
                </el-tooltip>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 mt-4 trix__wrapper" :style="getStyles" :disabled="!editMode">
            <trix
                :value="fetchData"
                :editMode="editMode"
                @on-update="onUpdate"/>
        </div>
    </div>
</template>

<script>
    import get from 'lodash/get'
    import Trix from '../../Trix/Trix'
    import {Switch, Tooltip} from 'element-ui'
    import {fullHeightIdentifier} from '@/enum/defaultWidgetSettings'

    export default {
        components: {
            Trix,
            [Switch.name]: Switch,
            [Tooltip.name]: Tooltip,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                editMode: this.editable,
            }
        },
        computed: {
            fetchData() {
                return this.data.WidgetLayout.trixData || {}
            },
            margins() {
                if (this.$rtl.isRTL) {
                    return this.editable ? 'ml-24' : 'ml-12'
                } else {
                    return this.editable ? 'mr-24' : 'mr-12'
                }
            },
            getStyles() {
                let height = get(this.data.WidgetLayout, 'height')

                if (!height || height === fullHeightIdentifier) {
                    height = 'auto'
                } else {
                    height = height + 'px'
                }

                return {
                    height: height,
                    overflow: 'auto'
                }
            },
            getInfo() {
                if (!this.data.LastUpdate) {
                    return this.data.Title
                }
                return this.data.Title + ' / ' + this.data.LastUpdate;
            }
        },
        methods: {
            onUpdate(val) {
                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...{trixData: val}
                }
                this.$emit('on-update', this.data)
                this.editMode = this.editable
            },
        },
        watch: {
            editable: {
                handler: function (state) {
                    this.editMode = state
                }
            },
        }
    }
</script>
<style lang="scss">
    .trix-widget {
        font-size: unset;
        font-weight: initial;

        .trix__wrapper[disabled="disabled"] {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .trix__wrapper {
            opacity: 1;
        }
    }

    .el-switch.is-checked .el-switch__core {
        @apply border-primary bg-primary;
    }


</style>
