<template>
    <div class="flex items-center"
         v-bind="$attrs">
        <el-upload
            action="default"
            accept="image/*"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="onFileChange"
        >
            <base-button class="mx-1"
                         size="xs"
                         fixed-width="w-20"
                         variant="discard">
                {{ $t('Change') }}
            </base-button>
        </el-upload>
    </div>
</template>
<script>
    import i18n from '@/i18n'
    import { getBase64 } from '@/helpers/util'
    import { Notification, Upload } from 'element-ui'
    
    export default {
        inheritAttrs: false,
        components: {
            [Upload.name]: Upload,
        },
        name: 'Logo',
        props: {
            LayoutParameterValueID: {
                type: [String, Number],
                default: '',
            },
            shadow: {
                type: Boolean,
                default: true,
            },
        },
        methods: {
            async onFileChange() {
                const file = event.target.files[0]
                //100 kb
                if (file && file.size > 100000) {
                    Notification.error({
                        title: i18n.t('Invalid Logo'),
                        message: i18n.t('Logo size should be less than 100kb'),
                    })
                    return
                }
                
                const logo = await getBase64(file)
                await this.$store.dispatch('layout/setLogo', logo)
            },
        },
    }
</script>
