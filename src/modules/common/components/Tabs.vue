<template>
    <div class="flex w-full flex-col">
        <nav class="flex w-full space-x-6"
             aria-label="Tabs">
            <div role="button" v-for="tab in options"
                 :key="tab.key"
                 @click="onChange(tab.key)"
                 class="shadow-base rounded-t-md transition ease-in-out duration-50 h-10 flex items-center justify-center font-medium text-sm hover:text-primary w-40"
                 :class="[tab.key === current ? 'text-gray-500' : 'bg-gray-100 text-gray-700']"
                 v-bind="$attrs">
                <component class="w-5 h-5 mx-1 text-primary"
                           :is="tab.icon"
                />
                <span class="leading-5 font-medium">
                    {{ $t(tab.label) }}
                </span>
            </div>
        </nav>
        <slot/>
    </div>
</template>
<script>
    export default {
        props: {
            current: {
                type: [String, Number],
                default: 0,
            },
            options: {
                type: Array,
                default: () => [],
            },
        },
        methods: {
            onChange(option) {
                this.$emit('on-change', option)
            },
        },
    }
</script>
