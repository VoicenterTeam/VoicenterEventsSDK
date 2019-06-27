<template>
    <button class="btn p-4 shadow rounded bg-white hover:bg-blue-100 active:shadow-inner" v-bind="$attrs" v-on="$listeners">
        <slot>
            <IconAdd class="w-4 h-4"></IconAdd>
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
