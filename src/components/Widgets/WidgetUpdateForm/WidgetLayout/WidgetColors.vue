<template>
    <el-collapse v-model="activeCollapse" class="pt-4">
        <el-collapse-item :title="$t('widget.colors.layout')" name="colors">
            <div class="flex">
                <el-color-picker v-model="model.colors.background"/>
                <span class="p-2">{{$t('settings.color.background')}}</span>
                <el-color-picker v-model="model.colors.frames"/>
                <span class="p-2">{{$t('settings.color.frames')}}</span>
                <el-color-picker v-model="model.colors.fonts"/>
                <span class="p-2">{{$t('settings.color.fonts')}}</span>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
    import {Collapse, CollapseItem, ColorPicker} from 'element-ui'

    export default {
        components: {
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [ColorPicker.name]: ColorPicker,
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
            }
        },
        mounted() {
            console.log('widget colors layout')
        }
    }
</script>
