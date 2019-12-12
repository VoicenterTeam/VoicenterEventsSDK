<template>
    <div class="w-full bg-white px-8 py-4 my-4 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex flex-row items-center justify-between">
            <slot name="title">
                <h5 class="text-2xl font-bold mx-3">
                    {{data.Title}}
                </h5>
            </slot>
            <slot name="content">
                <h2 class="text-6xl font-bold mx-3 text-green">
                    {{data.WidgetID}}
                </h2>
            </slot>
        </div>
    </div>
</template>
<script>
    //TODO: update with (tbd) data structure
    export default {
        name: 'statistics-cards',
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
    }
</script>
