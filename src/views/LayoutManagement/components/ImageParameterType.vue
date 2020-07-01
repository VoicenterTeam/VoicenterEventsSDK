<template>
    <div class="flex items-center pt-4 pb-2">
        <el-popover
            placement="top-start"
            trigger="hover">
            <div>
                {{$t('Recommended dimensions:')}}<br>
                {{$t('Maximum Height - 150px')}}<br>
                {{$t('Maximum Width - 700px')}}<br>
                {{$t('Maximum Size - 300 KB')}}
            </div>
            <AlertTriangleIcon class="text-orange-500 cursor-help" slot="reference"></AlertTriangleIcon>
        </el-popover>
        <div class="image-upload text-primary flex px-4">
            <label class="cursor-pointer flex items-center text-primary" :for="componentID">
                <IconUpload class="text-primary mr-2" :class="{'mr-0 ml-2': $rtl.isRTL}"/>
                {{$t('Upload Logo')}}
            </label>
            <img v-if="dashboardLogo" :src="dashboardLogo" alt="Logo" class="h-8 px-3">
            <input
                @change="onFileChange()"
                accept="image/*"
                :id="componentID"
                type="file"/>
        </div>
    </div>
</template>
<script>
    import {getBase64, makeRandomID} from '@/helpers/util'
    import {Popover} from 'element-ui'
    import {AlertTriangleIcon} from 'vue-feather-icons'

    export default {
        inheritAttrs: false,
        components: {
            AlertTriangleIcon,
            [Popover.name]: Popover,
        },
        name: 'Logo',
        props: {
            LayoutParameterValueID: {
                type: [ String, Number ],
                default: ''
            }
        },
        data() {
            const componentID = makeRandomID()
            return {
                logoName: '',
                componentID,
            }
        },
        computed: {
            dashboardLogo() {
                return this.$attrs.ValueText
            }
        },
        methods: {
            async onFileChange() {
                const file = event.target.files[0]
                const logo = await getBase64(file)
                this.$emit('input', logo);
            },
        },
    }
</script>
<style lang="scss" scoped>
    .image-upload > input {
        display: none;
    }
</style>
