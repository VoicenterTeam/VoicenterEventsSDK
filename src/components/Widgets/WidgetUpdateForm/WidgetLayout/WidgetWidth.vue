<template>
    <div class="pb-3">
        <div>
            <div class="flex items-center">{{$t('Desktop width')}}
                <MonitorIcon class="mx-2 w-5 h-5"/>
            </div>
            <el-select v-model="model.WidgetLayout.widths.desktop" class="w-full">
                <el-option v-for="option in widths" v-bind="option" :key="option.label"/>
            </el-select>
        </div>
        <div>
            <div class="flex items-center">{{$t('Tablet width')}}
                <TabletIcon class="mx-2 w-5 h-5"/>
            </div>
            <el-select v-model="model.WidgetLayout.widths.tablet" class="w-full">
                <el-option v-for="option in widths" v-bind="option" :key="option.label"/>
            </el-select>
        </div>
        <div>
            <div class="flex items-center">{{$t('Mobile width')}}
                <SmartphoneIcon class="mx-2 w-5 h-5"/>
            </div>
            <el-select v-model="model.WidgetLayout.widths.mobile" class="w-full">
                <el-option v-for="option in widths" v-bind="option" :key="option.label"/>
            </el-select>
        </div>
    </div>
</template>
<script>
    import {Option, Select} from 'element-ui'
    import {widths} from '@/enum/defaultWidgetSettings'
    import {MonitorIcon, SmartphoneIcon, TabletIcon} from 'vue-feather-icons'

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
            [MonitorIcon.name]: MonitorIcon,
            [TabletIcon.name]: TabletIcon,
            [SmartphoneIcon.name]: SmartphoneIcon,
        },
        data() {
            return {
                widths
            }
        },
    }
</script>
