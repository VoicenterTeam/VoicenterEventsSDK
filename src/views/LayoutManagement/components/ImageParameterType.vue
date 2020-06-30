<template>
    <div class="flex">
        <div class="image-upload text-primary flex pt-4 pb-2">
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
    import {getBase64} from '@/helpers/util'
    import {makeRandomID} from "@/helpers/util";

    export default {
        inheritAttrs: false,
        name: 'Logo',
        props: {
            LayoutParameterValueID: {
                type: [String, Number],
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
