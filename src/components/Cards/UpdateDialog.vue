<template>
    <el-dialog v-bind="$attrs" v-on="$listeners" :width="setWidth">
        <h5 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('extensionCard.update')}}</h5>
        <div class="flex items-center my-4">
            <slot name="header"></slot>
        </div>
        <div class="w-full flex flex-col">
            <slot name="content"></slot>
        </div>
        <template slot="footer">
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog} from 'element-ui'

    export default {
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
        },
        computed: {
            setWidth() {
                if (this.isMobileOrTablet) {
                    return '80%'
                } else {
                    return '40%'
                }
            }
        }
    }
</script>
