<template>
    <div>
        <div v-if="data.TemplateID === 78">
            <widget-note-list v-on="$listeners" :data="data" :editable="editable"/>
        </div>

        <div class="trix-widget" v-else>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full py-1">
                <div class="flex">
                    <p class="text-main-2xl font-semibold" v-if="data.Title">
                        {{getInfo}}
                    </p>
                </div>
                <div :class="margins" class="flex items-center">
                    <el-tooltip :content="$t('tooltip.set.edit.mode')" class="item" effect="dark" placement="top">
                        <el-switch v-model="editMode"/>
                    </el-tooltip>
                </div>
            </div>
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
    </div>
</template>
<script>
    import get from 'lodash/get'
    import format from 'date-fns/format'
    import parseISO from 'date-fns/parseISO'
    import HtmlEditor from '../../Html/HtmlEditor'
    import {Switch, Tooltip} from 'element-ui'
    import {defaultColors, fullHeightIdentifier} from '@/enum/defaultWidgetSettings'
    import WidgetNoteList from "@/components/Widgets/WidgetNoteList";

    export default {
        components: {
            WidgetNoteList,
            HtmlEditor,
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
        data () {
            return {
                editMode: this.editable,
            }
        },
        computed: {
            fetchData () {
                return this.data.WidgetLayout.htmlData || '<p>Click the switch to enable edit mode for this html</p>'
            },
            margins () {
                if (this.$rtl.isRTL) {
                    return this.editable ? 'ml-24' : 'ml-12'
                } else {
                    return this.editable ? 'mr-24' : 'mr-12'
                }
            },
            getStyles () {
                let height = get(this.data.WidgetLayout, 'height')

                if (!height || height === fullHeightIdentifier) {
                    height = 'auto'
                } else {
                    height = height + 'px'
                }
                let colors = get(this.data.WidgetLayout, 'colors') || defaultColors;
                return {
                    height: height,
                    overflow: 'auto',
                    border: 0,
                    backgroundColor: colors.background,
                    color: colors.fonts,
                    'margin-top': '10px'
                }
            },
            getInfo () {
                if (!this.data.LastUpdate) {
                    return this.data.Title
                }
                let date = this.data.LastUpdate
                try {
                    date = format(parseISO(this.data.LastUpdate), 'MMM dd HH:mm')
                } catch (e) {

                }
                return this.data.Title + ' / ' + date;
            }
        },
        methods: {
            onUpdate (val) {
                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...{htmlData: val}
                }
                this.$emit('on-update', this.data)
                this.editMode = false
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
    }

    .el-switch.is-checked .el-switch__core {
        @apply border-primary bg-primary;
    }
</style>
