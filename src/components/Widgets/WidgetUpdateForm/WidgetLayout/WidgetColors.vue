<template>
    <el-collapse v-model="activeCollapse" class="pt-4">
        <el-collapse-item :title="$t('widget.layout.colors')" name="colors">
            <div class="flex">
                <div class="flex" v-for="option of widgetColors">
                    <color-picker
                        v-model="model.colors[option]"
                        :predefine="predefinedColors"/>
                    <span class="p-2">{{$t('widget.settings.color.'+option)}}</span>
                </div>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
    import uniq from 'lodash/uniq'
    import values from 'lodash/values'
    import {Collapse, CollapseItem} from 'element-ui'
    import ColorPicker from '@/components/Common/ColorPicker'
    import {widgetColors} from '@/enum/layout'
    export default {
        components: {
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            ColorPicker
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                activeCollapse: 'colors',
                widgetColors
            }
        },
        computed: {
            predefinedColors() {
                let options = values(this.$store.getters['dashboards/baseColors'])
                return uniq(options)
            }
        }
    }
</script>
