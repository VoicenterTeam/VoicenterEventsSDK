<template>
    <div class="trix-widget">
        <div :style="getStyles" class="bg-white rounded">
            <div
                :style="getStyles"
                v-html="fetchData"
                v-if="!editMode">
            </div>
            <html-editor
                :editMode="editMode"
                :value="fetchData"
                @on-update="onUpdate"
                v-else/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { defaultColors } from '@/enum/defaultWidgetSettings'

    export default {
        components: {
            WidgetNoteList: () => import('@/components/Widgets/WidgetNoteList'),
            HtmlEditor: () => import('../../Html/HtmlEditor')
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: false,
            },
            onEditMode: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                editMode: false,
            }
        },
        computed: {
            fetchData() {
                return this.data.WidgetLayout.htmlData || `<p>${this.$t('widget.clickTheSwitchToEnableEditModeForThisHtml')}</p>`
            },
            margins() {
                if (this.$rtl.isRTL) {
                    return this.editable ? 'ml-24' : 'ml-12'
                } else {
                    return this.editable ? 'mr-24' : 'mr-12'
                }
            },
            getStyles() {
                let colors = get(this.data.WidgetLayout, 'colors') || defaultColors
                return {
                    border: 0,
                    backgroundColor: colors.background,
                    color: colors.fonts,
                    'margin-top': '10px',
                }
            },
        },
        methods: {
            onUpdate(val) {
                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    htmlData: val,
                }
                this.$emit('on-update', this.data)
                this.editMode = false
            },
        },
        mounted() {
            if (!this.data.WidgetLayout.hasOwnProperty('showLastUpdateDate')) {
                this.$set(this.data.WidgetLayout, 'showLastUpdateDate', true)
            }
        },
        watch: {
            editable: {
                handler(state) {
                    this.editMode = state
                },
            },
            onEditMode: {
                immediate: true,
                handler(state) {
                    this.editMode = state
                },
            },
        },
    }
</script>
<style lang="scss">
    .trix-widget {
        font-size: unset;
        font-weight: initial;
    }

    .el-switch.is-checked .el-switch__core {
        @apply border-primary bg-primary;
    }
</style>
