<template>
    <div class="relative base-input-errors">
        <div class="h-5 mb-1">
            <slot></slot>
            <div v-for="error in errors"
                 class="truncate mt-1"
                 :key="error">
                <p :key="error" class="text-sm text-red-600">{{ error }}</p>
            </div>
        </div>
    </div>
</template>
<script>
    
    export default {
        inheritAttrs: false,
        components: {},
        props: {
            help: {
                type: String,
                default: '',
            },
            errors: {
                type: Array,
                default: () => [],
            },
        },
    }
</script>
