<template>
    <div class="bg-white px-6 py-4 mb-4 flex items-center rounded-lg shadow">
        <slot name="icon">
            <component class="w-16 mr-4" :is="icon"></component>
        </slot>
        <slot name="title">
            <h5 class="text-3xl font-bold mr-4" v-if="title">
                {{title}}
            </h5>
        </slot>
        <slot name="description">
            <p class="text-gray-500 text-lg" v-if="description">{{description}}</p>
        </slot>
    </div>
</template>
<script>
  export default {
    props: {
      icon: String,
      title: String,
      description: String,
    }
  }
</script>
<style>
</style>
