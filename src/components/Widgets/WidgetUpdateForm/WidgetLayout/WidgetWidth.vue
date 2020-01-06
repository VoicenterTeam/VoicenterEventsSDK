<template>
    <div>
        <label>{{$t('Widget width')}}</label>
        <el-select v-model="model.WidgetLayout.width" class="w-full">
            <el-option v-for="option in widths" v-bind="option" :key="option.label"/>
        </el-select>
    </div>
</template>
<script>
    import {Select, Option} from 'element-ui'
    import {widths} from '@/enum/defaultWidgetSettings'

    export default {
        props: {
            model: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
        },
        data() {
            return {
                widths
            }
        }
    }
</script>
