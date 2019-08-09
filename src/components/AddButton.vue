<template>
    <button class="btn p-3 shadow rounded bg-white hover:bg-primary-100 active:shadow-inner" v-bind="$attrs" v-on="$listeners">
        <slot>
            <IconPlus class="w-3 h-3 text-primary"></IconPlus>
        </slot>
    </button>
</template>
<script>
  export default {
    inheritAttrs: false
  }
</script>
<style>
    .btn {
        transition: all .2s;
    }
    .btn:focus {
        outline: none;
        @apply shadow-outline;
    }
</style>
