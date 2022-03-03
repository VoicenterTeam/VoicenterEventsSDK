<template>
    <tag limit-with="150">
        <component :is="icon"
                   class="h-4 w-6 mx-1 text-primary text-gray-950"/>
        <div class="truncate">
            {{ name }}
        </div>
    </tag>
</template>
<script>
   
    export default {
        components: {
            Tag: () => import('@/modules/reports/components/Tag')
        },
        props: {
            name: String,
            icon: String,
            item: [Object, String],
        },
    }
</script>
