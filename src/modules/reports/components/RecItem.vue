<template>
    <tag limit-with="300">
        <component :is="icon"
                   class="h-4 w-6 mx-1 text-primary text-gray-950"/>
        <div class="truncate">
            {{ name }}
        </div>
    </tag>
</template>
<script>
    import Tag from '@/modules/reports/components/Tag'
    
    export default {
        components: {
            Tag,
        },
        props: {
            name: String,
            icon: String,
            item: [Object, String],
        },
    }
</script>
