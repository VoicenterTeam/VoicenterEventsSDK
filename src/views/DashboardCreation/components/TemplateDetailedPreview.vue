<template>
    <div class="grid grid-cols-6 gap-6 mt-6">
        <LayoutPreview
            class="col-span-4"
            :header-caption="false"
            :default-zoom="fixedZoom"/>
        <div class="col-span-2">
            lorem
        </div>
    </div>
</template>
<script>
    import LayoutPreview from '@/views/LayoutSettings/LayoutPreview'
    
    export default {
        components: {
            LayoutPreview,
        },
        props: {
            template: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                fixedZoom: 0.5
            }
        }
    }
</script>
