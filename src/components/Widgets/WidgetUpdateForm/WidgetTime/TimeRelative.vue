<template>
    <el-select v-model="model.WidgetTime.datedeff"
               placeholder="Select"
               class="w-full pt-2">
        <el-option
            v-for="(item, index) of widgetTimeOptions"
            :key="index"
            :label="$t(item.label)"
            :value="item.datedeff">
        </el-option>
    </el-select>
</template>
<script>
    import {Select, Option} from 'element-ui'

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
            widgetTimeOptions: {
                type: Array,
                default: () => []
            }
        },
    }
</script>
