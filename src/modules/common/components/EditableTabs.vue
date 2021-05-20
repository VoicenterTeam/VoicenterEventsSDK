<template>
    <div class="border-b border-gray-200 mb-12">
        <nav class="-mb-px flex space-x-8"
             aria-label="Tabs">
            <transition-group enter-active-class="transform transition ease-in-out duration-200"
                              enter-class="translate-x-2"
                              enter-to-class="translate-x-0"
                              leave-active-class="transform transition ease-in-out duration-200"
                              leave-class="translate-x-0"
                              leave-to-class="translate-x-2"
                              appear
            >
            <span v-for="tab in options"
                  :key="tab.name"
                  role="button"
                  @click="onChange(tab)"
                  :class="[tab.name === activeTab ? 'border-primary px-1' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'mx-2 group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm']">
                <component :is="tab.icon"
                           :class="[tab.name === activeTab ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500', 'mx-2 h-4-5 w-4-5']"
                           aria-hidden="true"/>
                <span>{{ tab.title }}</span>
            </span>
            </transition-group>
        </nav>
    </div>
</template>
<script>
    
    export default {
        props: {
            activeTab: {
                type: [String, Number],
                default: 0,
            },
            options: {
                type: Array,
                default: () => [],
            },
        },
        methods: {
            onChange(tab) {
                this.$emit('on-change', tab)
            },
        },
    }
</script>
