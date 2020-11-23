<template>
    <div class="flex items-center py-3 my-4 px-4 justify-between shadow-base">
        <div class="flex items-center">
            <img v-if="dashboardLogo" :src="dashboardLogo" alt="Logo" class="h-8">
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
        <el-popover
            placement="top-start"
            trigger="hover">
            <div>
                {{ $t('Recommended dimensions:') }}<br>
                {{ $t('Maximum Height - 150px') }}<br>
                {{ $t('Maximum Width - 700px') }}<br>
                {{ $t('Maximum Size - 100 KB') }}
            </div>
            <AlertTriangleIcon class="text-orange-500 cursor-help"
                               slot="reference"/>
        </el-popover>
    </div>
</template>
<script>
    import i18n from '@/i18n'
    import { getBase64 } from '@/helpers/util'
    import { Notification, Popover, Upload } from 'element-ui'
    import { AlertTriangleIcon } from 'vue-feather-icons'
    
    export default {
        inheritAttrs: false,
        components: {
            AlertTriangleIcon,
            [Upload.name]: Upload,
            [Popover.name]: Popover,
        },
        name: 'Logo',
        props: {
            LayoutParameterValueID: {
                type: [String, Number],
                default: '',
            },
        },
        computed: {
            dashboardLogo() {
                return this.$attrs.ValueText
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
                this.$emit('input', logo)
            },
        },
    }
</script>
