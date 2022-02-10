<template>
    <div class="w-full bg-gray-200">
        Edit page
        <div>{{data}}</div>
    </div>
</template>

<script>
export default {
    name: "edit-temp",
    props: {
      data: {
          type: Object,
          default: () => ({})
      }
    },
    data() {
        return {}
    }
}
</script>
