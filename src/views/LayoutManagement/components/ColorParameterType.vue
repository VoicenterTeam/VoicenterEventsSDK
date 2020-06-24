<template>
    <div class="flex flex-row pt-2 pb-1">
        <el-color-picker
            :predefine="predefinedColors"
            v-on="$listeners"
            v-bind="$attrs"
            />
        <span class="p-2 text-main-sm">{{$t(LayoutParameterName)}}</span>
    </div>
</template>
<script>
    import {ColorPicker} from 'element-ui'
    import {predefinedColors} from '../layout-management'

    export default {
        inheritAttrs: false,
        name: 'Color',
        components: {
            [ColorPicker.name]: ColorPicker,
        },
        props: {
            LayoutParameterName: {
                type: String,
                Default: '',
            },
        },
        data() {
            return {
                predefinedColors,
            }
        },
    }
</script>
