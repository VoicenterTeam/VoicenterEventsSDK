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
                         v-if="!disabled"
                         type="primary"
                         outline
                         size="sml"
                         fixed-width="w-20">
                {{ $t('Change') }}
            </base-button>
        </el-upload>
    </div>
</template>
<script>
    import { getBase64 } from '@/helpers/util'
    import { Upload } from 'element-ui'

    export default {
        inheritAttrs: false,
        components: {
            [Upload.name]: Upload,
        },
        name: 'Logo',
        props: {
            disabled: {
                type: Boolean,
                default: false,
            },
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
                // 100 kb
                if (file && file.size > 100000) {
                    this.$notify({
                        type: 'danger',
                        icon: true,
                        title: 'Invalid Logo',
                        message: 'Logo size should be less than 100kb',
                    })
                    return
                }

                const logo = await getBase64(file)
                await this.$store.dispatch('layout/setLogo', logo)
            },
        },
    }
</script>
