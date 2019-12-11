<template>
    <el-dialog v-bind="$attrs" v-on="$listeners" :width="setWidth">
        <h5 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('extensionCard.update')}}</h5>
        <div class="flex items-center my-4">
            <slot name="header"/>
        </div>
        <div class="w-full flex flex-col">
            <slot name="content"/>
        </div>
        <template slot="footer">
            <slot name="footer"/>
        </template>
        <WidgetColors :model="model"/>
    </el-dialog>
</template>
<script>
    import {Dialog} from 'element-ui'
    import WidgetColors from '../Widgets/WidgetUpdateForm/WidgetLayout/WidgetColors'

    export default {
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
            WidgetColors,
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            setWidth() {
                if (this.isMobileOrTablet) {
                    return '80%'
                } else {
                    return '40%'
                }
            }
        },
    }
</script>
